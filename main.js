const electron = require('electron');
const fspath = require('path');
const url = require('url');
const app = electron.app;
const shell = electron.shell;
const Menu = electron.Menu;
const Tray = electron.Tray;
const dialog = electron.dialog;
const ipcMain = electron.ipcMain;
const crashReporter = electron.crashReporter;
const BrowserWindow = electron.BrowserWindow;
const nativeImage = require('electron').nativeImage;
const options = { extraHeaders: 'pragma: no-cache\n' }
const app_icon = nativeImage.createFromPath(fspath.join(__dirname, 'icon.ico'));
let mainWindow, splashwindow;
var contextMenu = null;
var filepath = null;
var quitapp, URL;

function sleep(millis) {
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while (curDate - date < millis);
}

const BROWSER_WINDOW_OPTIONS = {
    minWidth: 400,
    minHeight: 300,
    width: 800,
    height: 600,
    show: false,
    icon: app_icon,
    webPreferences: {
        // TODO:
        // https://github.com/electron/electron/pull/794
        //
        // reconsider using nodeIntegration here as this might be a security
        // issue
        nodeIntegration: true,
        defaultEncoding: 'UTF-8'
    }
};

// enable the debugging port for chrome for now.  We should probably have an
// --enable-remote-debugging command line flag that would need to be set
// because I don't want to have to keep this port open all the time.

const REMOTE_DEBUGGING_PORT = '8315';

// TODO: if the __dirname has a space in it then I think the file URL will be
// wrong.

const DEFAULT_URL = 'file://' + __dirname + '/default.html';
//const DEFAULT_URL = 'file://' + __dirname + '/web/test-pagemark.html';

if (process.argv.includes("--enable-remote-debugging")) {

    console.log(`Remote debugging port enabled on port ${REMOTE_DEBUGGING_PORT}.`);
    console.log(`You may connect via http://localhost:${REMOTE_DEBUGGING_PORT}`);

    app.commandLine.appendSwitch('remote-debugging-port', REMOTE_DEBUGGING_PORT);
    app.commandLine.appendSwitch('host-rules', 'MAP * 127.0.0.1');

}

// TODO: enable this again but only when we have a good receiver URL.
//crashReporter.start({ productName: 'Polar eBook Reader',
//                      companyName: 'Polar Contributors',
//                      submitURL: 'https://praharsh.xyz/projects/PDFViewer/crash',
//                      autoSubmit: false });

//creating menus for menu bar
const template = [{
        label: 'File',
        submenu: [{
                label: 'Open',
                accelerator: 'CmdOrCtrl+O',
                click: function(item, focusedWindow) {
                    if (focusedWindow) {
                        dialog.showOpenDialog({
                            filters: [
                                { name: 'PDF', extensions: ['pdf'] }
                            ],
                            properties: ['openFile']
                        }, function(path) {
                            if (path) {
                                filepath = path;
                                if (path.constructor === Array)
                                    path = path[0];

                                // FIXME: cmaps are disabled when loading from file URLs so I need to look into this problem...
                                mainWindow.loadURL('file://' + __dirname + '/pdfviewer/web/viewer.html?file=' + encodeURIComponent(path), options);

                                mainWindow.webContents.on('did-finish-load', function() {
                                    console.log("Finished loading. Now injecting customizations.");
                                    injectCustomizations(mainWindow.webContents);
                                    console.log("Toggling dev tools...");
                                    mainWindow.toggleDevTools();
                                });

                            }
                        });
                    }
                }
            },
            {
                label: 'Open Containing Folder',
                accelerator: 'CmdOrCtrl+F',
                click: function(item, focusedWindow) {
                    if (focusedWindow && filepath)
                        shell.showItemInFolder("file:///" + filepath);
                }
            },
            {
                label: 'Print',
                accelerator: 'CmdOrCtrl+P',
                click: function(item, focusedWindow) {
                    if (focusedWindow) focusedWindow.webContents.print();
                }
            },
            {
                label: 'Close',
                accelerator: 'Shift+CmdOrCtrl+Z',
                click: function(item, focusedWindow) {
                    if (focusedWindow) focusedWindow.loadURL(DEFAULT_URL, options);
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Exit',
                accelerator: 'Alt+F4',
                role: 'close'
            },
        ]
    },
    {
        label: 'Edit',
        submenu: [
            { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
            { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
            { type: 'separator' },
            { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
            { label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectall' },
        ]
    },
    {
        label: 'View',
        submenu: [{
                label: 'Reload',
                accelerator: 'CmdOrCtrl+R',
                click: function(item, focusedWindow) {
                    if (focusedWindow)
                        focusedWindow.webContents.reloadIgnoringCache();
                }
            },
            {
                label: 'Toggle Full Screen',
                accelerator: (function() {
                    if (process.platform == 'darwin')
                        return 'Ctrl+Command+F';
                    else
                        return 'F11';
                })(),
                click: function(item, focusedWindow) {
                    if (focusedWindow)
                        focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                }
            },
        ]
    },
    {
        label: 'Window',
        role: 'window',
        submenu: [
            { label: 'Minimize', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
            { label: 'Close', accelerator: 'CmdOrCtrl+W', role: 'close' },
        ]
    },
    {
        label: 'Help',
        role: 'help',
        submenu: [{
                label: 'About',
                click: function() {
                    dialog.showMessageBox(mainWindow, {
                        type: 'info',
                        buttons: ['OK'],
                        title: 'Polar eBook Reader 1.0',
                        message: 'Version 1.0',
                        detail: 'Created By - Praharsh Jain',
                        icon: app_icon
                    });
                }
            },
            { label: 'Learn More', click: function() { shell.openExternal('https://github.com/praharshjain/Electron-PDF-Viewer'); } },
        ]
    },
];
var menu = Menu.buildFromTemplate(template);
var shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
    }
});
if (shouldQuit) { app.quit(); return; }
app.on('ready', function() {
    splashwindow = new BrowserWindow({ width: 400, height: 300, center: true, resizable: false, movable: false, alwaysOnTop: true, skipTaskbar: true, frame: false });
    splashwindow.loadURL('file://' + __dirname + '/splash.html');
    contextMenu = Menu.buildFromTemplate([
        { label: 'Minimize', type: 'radio', role: 'minimize' },
        { type: 'separator' },
        { label: 'Exit', type: 'radio', role: 'close' },
    ]);
    //for OS-X
    if (app.dock) {
        app.dock.setIcon(app_icon);
        app.dock.setMenu(contextMenu);
    }
    Menu.setApplicationMenu(menu);
    const appIcon = new Tray(app_icon);
    appIcon.setToolTip('PDF Viewer');
    appIcon.setContextMenu(contextMenu);
    //splash screen for 3 seconds
    setTimeout(createWindow, 3000);
});
// Quit when all windows are closed.
app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') { app.quit(); }
});
app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) { createWindow(); }
});

function injectScript(webContents, src) {
    webContents.executeJavaScript(`var script = document.createElement('script'); script.setAttribute('src', '${src}'); document.head.appendChild(script);`)
}

/**
 * Inject our customization around PDFs including custom CSS and custom scripts.
 */
function injectCustomizations(webContents) {

    // inject our customizations manually so that we can just depend on the
    // stock pdf.js viewer.html application.

    // for now, inject one script, which in the browser context, injects
    // the rest of the scripts.
    injectScript(webContents, '../../web/inject.js');

}

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow(BROWSER_WINDOW_OPTIONS);
    mainWindow.on('close', function(e) {
        e.preventDefault();
        mainWindow.webContents.clearHistory();
        mainWindow.webContents.session.clearCache(function() {
            mainWindow.destroy();
        });
    });
    mainWindow.on('closed', function() {
        mainWindow = null;
        app.quit();
    });
    mainWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        shell.openExternal(url);
    });
    mainWindow.webContents.on('devtools-opened', function(e) {
        e.preventDefault();
        this.closeDevTools();
    });
    mainWindow.webContents.on('will-navigate', function(e, url) {
        e.preventDefault();
        shell.openExternal(url);
    });
    mainWindow.loadURL(DEFAULT_URL, options);
    mainWindow.once('ready-to-show', () => {
        splashwindow.close();
        splashwindow = null;
        mainWindow.maximize();
        mainWindow.show();
    });
}

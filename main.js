const electron = require('electron');
const fspath = require('path');
const url = require('url');
const {DiskDatastore} = require("./web/js/datastore/DiskDatastore");

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
const webserver = require("./node/webserver");

let mainWindow, splashwindow;
let contextMenu = null;
let filepath = null;
let quitapp, URL;

// share the disk datastore with the remote.
global.diskDatastore = new DiskDatastore();

function sleep(millis) {
    let date = new Date();
    let curDate = null;
    do { curDate = new Date(); }
    while (curDate - date < millis);
}


const BROWSER_WINDOW_OPTIONS = {
    minWidth: 400,
    minHeight: 300,
    width: 800,
    height: 600,
    show: false,
    // https://electronjs.org/docs/api/browser-window#new-browserwindowoptions
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

const WEBSERVER_PORT = 8500;

// TODO: I think we need to wait until the webserver port is available before
// continuing.
const webserverDaemon = new webserver.WebserverDaemon(".", WEBSERVER_PORT);
webserverDaemon.start();

// TODO: if the __dirname has a space in it then I think the file URL will be
// wrong.

//const DEFAULT_URL = `http://localhost:${WEBSERVER_PORT}/default.html`;
const DEFAULT_URL = 'file://' + __dirname + '/default.html';

let enableConsoleLogging = false;

if (process.argv.includes("--enable-console-logging")) {
    console.log("Console logging enabled.");
    enableConsoleLogging = true;
}

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

                                loadPDF(path);

                            }
                        });
                    }
                }
            },
            // {
            //     label: 'Open Containing Folder',
            //     accelerator: 'CmdOrCtrl+F',
            //     click: function(item, focusedWindow) {
            //         if (focusedWindow && filepath)
            //             shell.showItemInFolder("file:///" + filepath);
            //     }
            // },
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
                        title: 'Polar Bookshelf',
                        message: 'Version 1.0',
                        detail: '',
                        icon: app_icon
                    });
                }
            },
            { label: 'Learn More', click: function() { shell.openExternal('https://github.com/burtonator/polar-bookshelf'); } },
        ]
    },
];

let menu = Menu.buildFromTemplate(template);
let shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
    }
});

if (shouldQuit) { app.quit(); return; }

app.on('ready', function() {

    // FIXME: remove the splash screen support. It just slows us down.

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

    // NOTE: removing the next three lines removes the colors in the toolbar.
    const appIcon = new Tray(app_icon);
    appIcon.setToolTip('Polar Bookshelf');
    appIcon.setContextMenu(contextMenu);

    createWindow();
    //setTimeout(createWindow, 1);

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

/**
 * Load a PDF file when given a full URL.  May be file, http, or https URL.
 *
 * @param url
 */
function loadPDF(path) {

    // FIXME: cmaps are disabled when loading from file URLs so I need to look into this problem...
    mainWindow.loadURL('file://' + __dirname + '/pdfviewer/web/viewer.html?file=' + encodeURIComponent(path), options);
    //mainWindow.loadURL(`http://localhost:${WEBSERVER_PORT}/pdfviewer/web/viewer.html?file=` + encodeURIComponent(path), options);

    if(enableConsoleLogging) {
        mainWindow.webContents.on("console-message", consoleListener);
    }

    mainWindow.webContents.on('did-finish-load', function() {
        console.log("Finished loading. Now injecting customizations.");
        console.log("Toggling dev tools...");
        mainWindow.toggleDevTools();
    });

}

/**
 * Listen to messages generated in the console so that we can log them to the
 * main console when --enable-console is used.
 *
 * https://github.com/electron/electron/blob/master/docs/api/web-contents.md#event-console-message
 *
 *
 * Returns:
 *
 * event Event
 * level Integer
 * message String
 * line Integer
 * sourceId String
 *
 */
function consoleListener(event, level, message, line, sourceId) {

    console.log(`level=${level} ${sourceId}:${line}: ${message}`);

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

    // if there is a PDF file to open, load that, otherwise, load the default URL.

    let lastArg = process.argv[process.argv.length - 1];
    if(lastArg && lastArg.endsWith(".pdf")) {
        loadPDF(lastArg);
    } else {
        mainWindow.loadURL(DEFAULT_URL, options);
    }

    mainWindow.once('ready-to-show', () => {
        mainWindow.maximize();
        mainWindow.show();
    });
}

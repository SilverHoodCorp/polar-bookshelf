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
const app_icon = nativeImage.createFromPath(fspath.join(__dirname, 'icon.png'));
const {WebserverConfig} = require("./web/js/backend/WebserverConfig");
const {Webserver} = require("./web/js/backend/Webserver");
const {FileRegistry} = require("./web/js/backend/FileRegistry");

let mainWindow, splashwindow;
let contextMenu = null;
let filepath = null;
let quitapp, URL;

// share the disk datastore with the remote.
global.diskDatastore = new DiskDatastore();

const BROWSER_WINDOW_OPTIONS = {
    minWidth: 400,
    minHeight: 300,
    width: 1280,
    height: 1024,
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
const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_URL = `http://${DEFAULT_HOST}:${WEBSERVER_PORT}/default.html`;

// TODO: I think we need to wait until the webserver port is available before
// continuing.

console.log("Electron app path is: " + app.getAppPath());

const webserverConfig = new WebserverConfig(app.getAppPath(), WEBSERVER_PORT);

const fileRegistry = new FileRegistry(webserverConfig);

const webserver = new Webserver(webserverConfig, fileRegistry);
webserver.start();

//const DEFAULT_URL = 'file://' + __dirname + '/default.html';

let enableConsoleLogging = false;

if (process.argv.includes("--enable-console-logging")) {
    console.log("Console logging enabled.");
    enableConsoleLogging = true;
}

if (process.argv.includes("--enable-remote-debugging")) {

    console.log(`Remote debugging port enabled on port ${REMOTE_DEBUGGING_PORT}.`);
    console.log(`You may connect via http://${DEFAULT_HOST}:${REMOTE_DEBUGGING_PORT}`);

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
        submenu: [

            {
                label: 'New Window',
                accelerator: 'CmdOrCtrl+N',
                click: cmdNewWindow
            },

            {
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

                                loadPDF(path, focusedWindow);

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
                    if (process.platform === 'darwin')
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
                click: function(item, focusedWindow) {
                    dialog.showMessageBox(focusedWindow, {
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
    // I'm not sure if this is the right strategy for now.

    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
    }

});

if (shouldQuit) { app.quit(); return; }

app.on('ready', function() {

    contextMenu = Menu.buildFromTemplate([
        { label: 'Minimize', type: 'radio', role: 'minimize' },
        { type: 'separator' },
        { label: 'Exit', type: 'radio', role: 'close' },
    ]);

    //for OS-X
    //if (app.dock) {
    //    app.dock.setIcon(app_icon);
    //    app.dock.setMenu(contextMenu);
    //}

    Menu.setApplicationMenu(menu);

    // NOTE: removing the next three lines removes the colors in the toolbar.
    //const appIcon = new Tray(app_icon);
    //appIcon.setToolTip('Polar Bookshelf');
    //appIcon.setContextMenu(contextMenu);

    mainWindow = createWindow();
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
function loadPDF(path, focusedWindow) {

    let fileMeta = fileRegistry.registerFile(path);

    console.log("Loading PDF via HTTP server: " + JSON.stringify(fileMeta));

    focusedWindow.loadURL(`http://${DEFAULT_HOST}:${WEBSERVER_PORT}/pdfviewer/web/viewer.html?file=` + encodeURIComponent(fileMeta.url), options);

    if(enableConsoleLogging) {
        focusedWindow.webContents.on("console-message", consoleListener);
    }

    focusedWindow.webContents.on('did-finish-load', function() {
        console.log("Finished loading. Now injecting customizations.");
        console.log("Toggling dev tools...");
        focusedWindow.toggleDevTools();
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

function cmdNewWindow(item, focusedWindow) {
    createWindow();
}

function createWindow() {

    // Create the browser window.
    let newWindow = new BrowserWindow(BROWSER_WINDOW_OPTIONS);

    newWindow.on('close', function(e) {
        e.preventDefault();
        newWindow.webContents.clearHistory();
        newWindow.webContents.session.clearCache(function() {
            newWindow.destroy();
        });
    });

    newWindow.on('closed', function() {

        if(BrowserWindow.getAllWindows().length === 0) {
            // determine if we need to quit:
            console.log("No windows left. Quitting app.");
            app.quit();

        }

    });

    newWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        shell.openExternal(url);
    });

    // TODO: we need SANE handling of dev tools.  Having it forced on us isn't fun.
    newWindow.webContents.on('devtools-opened', function(e) {
       e.preventDefault();
       this.closeDevTools();
    });

    newWindow.webContents.on('will-navigate', function(e, url) {
        e.preventDefault();
        shell.openExternal(url);
    });

    // if there is a PDF file to open, load that, otherwise, load the default URL.

    let lastArg = process.argv[process.argv.length - 1];
    if(lastArg && lastArg.endsWith(".pdf")) {
        loadPDF(lastArg, newWindow);
    } else {
        newWindow.loadURL(DEFAULT_URL, options);
    }

    newWindow.once('ready-to-show', () => {
        //newWindow.maximize();
        newWindow.show();
    });

    return newWindow;

}

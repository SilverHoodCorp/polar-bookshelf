module.exports.Electron = class {

    static isElectron() {
        var userAgent = navigator.userAgent.toLowerCase();
        return userAgent.indexOf(' electron/') !== -1;
    }

};

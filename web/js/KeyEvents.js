module.exports.KeyEvents = class {

    /**
     * Return true if the 'meta' keys are active. 
     */
    static isKeyMetaActive(event) {
        if (KeyEvents.isMacOS()) {
            return event.altKey && event.metaKey;
        } else {
            return event.ctrlKey && event.altKey;
        }
    }

    static isMacOS() {
        return navigator.platform === "MacIntel";
    }

};
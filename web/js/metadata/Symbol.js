module.exports.Symbol = class {

    constructor(name) {
        this.name = name;
        Object.freeze(this);
    }

    toJSON() {
        return this.name;
    }

};

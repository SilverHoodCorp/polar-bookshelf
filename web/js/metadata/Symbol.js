module.exports.Symbol = class {

    constructor(name) {
        this.name = name;
    }

    toJSON() {
        return this.name;
    }

}

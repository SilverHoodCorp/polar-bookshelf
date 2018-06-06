module.exports.Preconditions = class {

    static assertNotNull(value, name) {

        if (!value) {
            throw new Error(`Precondition (argument) for '${name}' false or undefined.`)
        }
    }

    static assertTypeof(value, name, expected) {

        if (typeof value !== expected ) {
            throw new Error(`Precondition for typeof '${name}' was not ${expected} but actually: ` + typeof value);
        }
    }
};

module.exports.Preconditions = class {

    static assertInstanceOf(value, name, instance) {

        if ((value instanceof instance)) {
            throw new Error(`Precondition for instanceof '${name}' was not ${instance}.`);
        }

        return value;

    }

    static assertTypeOf(value, name, type) {

        if (!(typeof value === type)) {
            throw new Error(`Precondition for typeof '${name}' was not ${type}.`);
        }

        return value;

    }

    static assertNotNull(value, name) {

        if (value === null) {
            throw new Error(`Precondition (argument) for '${name}' null.`)
        }

        if (value === undefined) {
            throw new Error(`Precondition (argument) for '${name}' undefined.`)
        }

        return value;

    }

    static assertNotTypeOf(value, name, type) {

        if (typeof value === type ) {
            throw new Error(`Precondition for typeof '${name}' was ${type} but not allowed`);
        }

        return value;

    }

    static assertNotInstanceOf(value, name, instance) {

        if (value instanceof instance) {
            throw new Error(`Precondition for instanceof '${name}' was ${instance} but not allowed`);
        }

        return value;

    }

    static assertTypeof(value, name, expected) {

        if (typeof value !== expected ) {
            throw new Error(`Precondition for typeof '${name}' was not ${expected} but actually: ` + typeof value);
        }

        return value;

    }
};

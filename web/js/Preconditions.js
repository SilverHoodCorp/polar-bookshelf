module.exports.Preconditions = class {

    static assertNotNull(value, name) {

        if (!value) {
            throw new Error(`Precondition (argument) for '${name}' false or undefined.`)
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

        if (value instanceof instance ) {
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

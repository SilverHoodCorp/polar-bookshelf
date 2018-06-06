

/**
 * Basic serialized object pattern. Take a closure as an argument to init,
 * and then assign the fields.  Then setup and validate that we have our
 * required data structures.
 */
module.exports.SerializedObject = class {

    constructor(val) {
        // noop
    }

    init(val) {

        if(arguments.length > 1) {
            throw new Error("Too many arguments");
        }

        if(typeof val === "object") {

            Object.assign(this, val);
            this.setup();
            this.validate();

        }

    }

    setup() {

    }

    validate() {

    }

    validateMemberExists(name) {

        if(!this[name]) {
            throw new Error(`Member field '${name}' missing.`);
        }

    }

    /**
     * Validate that the member is defined and that it has the given type.
     *
     * These are instance types compared via instanceof
     *
     * @param name The name of the member.
     * @param instanceType The instance type we expect
     */
    validateMemberInstanceOf(name, instance) {

        this.validateMemberExists(name);

        if( ! this[name] instanceof instance) {
            throw new Error(`Member field '${name}' is not a instance of ${instance}`);
        }
    }

    /**
     * Validate that the given member exists and it is a typeof of 'type'
     *
     * The types in this case are primitive types compared with typeof
     *
     * @param name The name of the member.
     * @param instanceType The instance type we expect
     */
    validateMemberTypeOf(name, type) {

        this.validateMemberExists(name);

        if( ! typeof this[name] === type) {
            throw new Error(`Member field '${name}' is not a type of ${type}`);
        }

    }

    validateMember(member) {

        if (member.instance) {
            this.validateMemberInstanceOf(member.name, member.instance);
        } else if(member.type) {
            this.validateMemberTypeOf(member.name, member.type);
        } else {
            throw new Error("Unable to handle member: ", member);
        }
    }

    validateMembers(members) {

        // TODO: needs testing.

        var caller = this;

        members.forEach(this.validateMember.bind(this));

    }

};
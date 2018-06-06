/**
 * A simple map of the object and the path to get to that object.
 *
 * We're able walk an entire object decomposing it into a list of
 * ObjectPathEntry objects which make it easier to test and debug rather than
 * dealing with recursive objects.
 *
 * @type {ObjectPathEntry}
 */
module.exports.ObjectPathEntry = class {

    constructor(path, value, parent, parentKey) {

        /**
         * The parent object which holds a reference to this object, or null if
         * it is the root.
         * @type {Window}
         */
        this.parent = parent;

        /**
         * The key of this object within the parent.
         */
        this.parentKey = parentKey;

        /**
         * The full path to this object from the root.
         */
        this.path = path;

        /**
         * The actual value of this object.
         */
        this.value = value;

    }

};

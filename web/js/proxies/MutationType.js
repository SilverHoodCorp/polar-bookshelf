module.exports.MutationType = Object.freeze({

    /**
     * The initial value.  This is called when you want to get the
     * current/initial value but then all new mutations.
     */
    INITIAL: "INITIAL",

    /**
     * Set of the value. IE foo=bar
     */
    SET: "SET",

    /**
     * Deletion of the value.  Removal. This is different from setting it to
     * null as the key no longer exists in the object.
     */
    DELETE: "DELETE"

});

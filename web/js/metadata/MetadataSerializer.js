const {ISODateTime} = require("./ISODateTime");


/**
 * All JSON must go through the metadata serializer so we can handle proper
 * serialization but also object validation once they are deserialized.
 */
module.exports.MetadataSerializer = class {

    static replacer(key, value) {
        if(value instanceof ISODateTime) {
            return value.toJSON();
        }

        return value;

    }

    static serialize(object, spacing) {
        //return JSON.stringify(object, MetadataSerializer.replacer, "");

        // FIXME: if this is a SerializedObject, call validate() before we return it

        if (!spacing) {
            spacing = "";
        }

        return JSON.stringify(object, null, spacing);
    }

    /**
     * Given an instance of an object, and a JSON string, deserialize the string into
     * the object.
     * @param object
     * @param data
     */
    static deserialize(obj,data) {

        if(!data) {
            throw new Error("No data given!")
        }

        let parsed = JSON.parse(data);
        Object.assign(obj, parsed);
        return obj;
    }

};

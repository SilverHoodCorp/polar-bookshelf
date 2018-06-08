const {ISODateTime} = require("./ISODateTime");
const {SerializedObject} = require("./SerializedObject");


/**
 * All JSON must go through the metadata serializer so we can handle proper
 * serialization but also object validation once they are deserialized.
 */
class MetadataSerializer {

    static replacer(key, value) {

        if(value instanceof SerializedObject) {
            value.setup();
            value.validate();
        }

        return value;

    }

    static reviver(key, value) {

        if(value instanceof SerializedObject) {
            value.setup();
            value.validate();
        }

        return value;

    }

    static serialize(object, spacing) {
        //return JSON.stringify(object, MetadataSerializer.replacer, "");

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

module.exports.MetadataSerializer = MetadataSerializer;

/**
 * Framework to create listeners to watch changes in dictionaries.  We can
 * change these into observables if we want by making them streams of SET and
 * DELETE operations but since we're not really using RxJS or anything of the
 * sort yet our options are open.
 */
const {ProxyBuilder} = require("./ProxyBuilder");

module.exports.Proxies = class {

    // FIXME:
    //
    // now I need a way to replace full object graphs with proxies so I can replace / setup mutation listeners on objects.
    //
    // I'm going to need to have ___path defined which we ignore in JSON serializers.

    // FIXME: it should be possible to listen to a specific property not just
    // all the properties...
    //
    // maybe soemthing like
    //
    // createDictListener().forProperty("asdf")
    //
    // also .asMutations()
    // asListener(onSet,onDelete)

    /**
     * Create a listener for the dictionary and call onSet and onDelete when
     * the dictionary has had keys set or deleted.
     *
     * @param target
     * @return ProxyBuilder
     */
    static create(target) {

        if(typeof target !== "object") {
            throw new Error("Only works on objects");
        }

        //return new Proxy(target, new ProxyHandler(onSet, onDelete));
        return new ProxyBuilder(target);
    }

};







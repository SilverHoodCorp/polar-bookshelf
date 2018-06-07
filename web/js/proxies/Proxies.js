/**
 * Framework to create listeners to watch changes in dictionaries.  We can
 * change these into observables if we want by making them streams of SET and
 * DELETE operations but since we're not really using RxJS or anything of the
 * sort yet our options are open.
 *
 * Note that Object.observe and other changes were apparently never ratified
 * so we have to use Proxy objects to implement this functionality.
 */
const {ProxyBuilder} = require("./ProxyBuilder");

module.exports.Proxies = class {

    /**
     * Create a listener for the dictionary and call onSet and onDelete when
     * the dictionary has had keys set or deleted.
     *
     * @param target
     * @return ProxyBuilder
     */
    static create(target) {

        if(typeof target !== "object") {
            throw new Error("Only works on objects: " + typeof target);
        }

        //return new Proxy(target, new ProxyHandler(onSet, onDelete));
        return new ProxyBuilder(target);
    }

};







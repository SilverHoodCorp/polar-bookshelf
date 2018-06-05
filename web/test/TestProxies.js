

var assert = chai.assert;
var expect = chai.expect;

import {Proxies} from "../js/Proxies.js";

class MyTracingListener {

    constructor() {
        // keep track of mutations as they happen.
        this.mutations = [];
    }

    onTrace(path, mutationType, target, property, value) {
        this.mutations.push({path, mutationType, target, property, value});
        return true;
    }

}

describe('Testing proxies', function() {

    it('Test deep', function () {

        Proxies.create()

    });

});
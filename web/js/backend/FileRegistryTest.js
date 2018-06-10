const fs = require('fs');
const assert = require('assert');
const http = require('http');

const {Webserver} = require('./Webserver');
const {Hashcodes} = require('../Hashcodes');
const {FileRegistry} = require('./FileRegistry');
const {WebserverConfig} = require('./WebserverConfig');
const {assertJSON} = require("../test/Assertions");

const webserverConfig = new WebserverConfig(".", 8080);

describe('FileRegistry', function() {

    describe('create', function() {

        it("basic", function () {

            let fileRegistry = new FileRegistry(webserverConfig);

            assert.equal(fileRegistry.hasKey("0x0001"), false);

            let registerData = fileRegistry.register("0x0001", "./package.json");

            let expected = {
                "key": "0x0001",
                "filename": "/home/burton/projects/polar-bookshelf/package.json",
                "url": "http://127.0.0.1:8080/files/0x0001"
            };

            assertJSON(registerData, expected);

            assert.equal(fileRegistry.hasKey("0x0001"), true);

        });

        it("registerFile", async function () {


        });

    });

});

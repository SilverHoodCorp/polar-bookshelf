const http = require('http');
const fs = require('fs');
const assert = require('assert');

const {Webserver} = require('./Webserver');
const {FileRegistry} = require('./FileRegistry');
const {WebserverConfig} = require('./WebserverConfig');
const {Hashcodes} = require('../Hashcodes');
const {assertJSON} = require("../test/Assertions");

describe('Webserver', function() {

    describe('create', function() {

        it("basic", function () {

            let webserverConfig = new WebserverConfig("..", 8085);

            let webserver = new Webserver(webserverConfig);
            webserver.start();
            webserver.stop();

        });

        it("registerFile", async function () {

            let webserverConfig = new WebserverConfig("..", 8095);
            let fileRegistry = new FileRegistry(webserverConfig);
            let webserver = new Webserver(webserverConfig, fileRegistry);

            webserver.start();
            let filename = "./package.json";
            let fileMeta = fileRegistry.register("0x000", filename);

            let hashcode = Hashcodes.create(await read(filename));

            let expected = {
                "key": "0x000",
                "filename": "/home/burton/projects/polar-bookshelf/package.json",
                "url": "http://127.0.0.1:8095/files/0x000"
            };

            assertJSON(fileMeta, expected);

            let data = await fetch(fileMeta.url);

            assertJSON(hashcode, Hashcodes.create(data));

            webserver.stop();

        });

    });

});

async function read(filename) {

    return new Promise(function (resolve, reject) {

        fs.readFile(filename, function(err, contents) {
            if(err) {
                reject(err);
            } else {
                resolve(contents);
            }
        });

    });

}

async function fetch(url) {

    return new Promise(function (resolve, reject) {

        http.get(url, function(response) {

            if(response.statusCode !== 200) {
                reject(new Error("Wrong status code: " + response.statusCode));
            }

            // reject if we don't have the proper response

            let data = [];

            response.on('data', function(chunk) {
                console.log("Got chunk");
                data.push(chunk);
            });

            response.on('end', function() {

                console.log("Got end of data");

                //at this point data is an array of Buffers
                //so Buffer.concat() can make us a new Buffer
                //of all of them together
                let buffer = Buffer.concat(data);
                resolve(buffer);

            });

        });

    });

}

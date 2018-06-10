const fs = require('fs');
const assert = require('assert');
const {Webserver} = require('./Webserver');
const {Hashcodes} = require('./Hashcodes');
const http = require('http');

describe('Webserver', function() {

    describe('create', function() {

        it("basic", function () {

            let webserver = new Webserver("..", 8085);
            webserver.start();
            webserver.stop();

        });

        it("registerFile", async function () {

            let port = 8095;

            let webserver = new Webserver("..", port);
            webserver.start();
            let filename = "./package.json";
            webserver.registerFile("0x000", filename);

            let hashcode = Hashcodes.create(await read(filename));

            let data = await fetch(`http://localhost:${port}/files/0x000`);

            assert.equal(hashcode, Hashcodes.create(data));

            //console.log(data.toString());
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

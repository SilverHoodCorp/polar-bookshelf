const fs = require('fs');
const {DiskDatastore} = require("./DiskDatastore");
var rimraf = require('rimraf');
var assert = require('assert');

const {Objects} = require("../utils");
const {assertJSON} = require("../test/Assertions");


describe('DiskDatastore', function() {

    it("test async exists function", async function () {

        let dataDir = "/tmp/this-file-does-not-exist";

        let diskDatastore = new DiskDatastore(dataDir);

        assert.equal(fs.existsSync(dataDir), false)
        assert.equal(await diskDatastore.existsAsync(dataDir), false)

        // now create it and

    });

    it("init dataDir directory on init()", async function () {

        let dataDir = "/tmp/disk-datastore.test";
        rimraf.sync(dataDir);

        let diskDatastore = new DiskDatastore(dataDir);

        assert.equal(await diskDatastore.existsAsync(dataDir), false)

        let expected = {
            dataDir: '/tmp/disk-datastore.test',
            dataDirCreated: true
        };

        // test double init...
        assert.deepEqual(await diskDatastore.init(), expected );

        expected = {
            dataDir: '/tmp/disk-datastore.test',
            exists: true
        };

        assert.deepEqual(await diskDatastore.init(), expected );

    });

    it("getDataDir", function () {

        assert.notEqual(DiskDatastore.getDataDir(), null);

    });

});

//
//
//
// async function testBasicFileOperations() {
//
//     let testFilePath = "/tmp/test.write";
//     let testDirPath = "/tmp/test.dir";
//
//     // test removing files
//     await diskDatastore.unlinkAsync(testFilePath)
//                        .catch(function (err) {})
//     await diskDatastore.rmdirAsync(testDirPath)
//                        .catch(function (err) {console.error(err)})
//
//     // test access
//
//     var canAccess =
//         await diskDatastore.accessAsync(testFilePath, fs.constants.R_OK | fs.constants.W_OK)
//                            .then(() => true)
//                            .catch(() => false);
//
//     assert.equal(canAccess, false);
//
//     // test writing
//     await diskDatastore.writeFileAsync(testFilePath, "asdf", {});
//
//     // now see if the file exists.
//
//     var canAccess =
//         await diskDatastore.accessAsync(testFilePath, fs.constants.R_OK | fs.constants.W_OK)
//                            .then(() => true)
//                            .catch(() => false);
//
//     assert.equal(canAccess, true);
//
//     // test reading
//     var result = await diskDatastore.readFileAsync(testFilePath);
//     assert.equal("asdf", result);
//
//     // test removing files
//     await diskDatastore.unlinkAsync(testFilePath);
//
//     await diskDatastore.mkdirAsync(testDirPath)
//
//     // now stat() the dir to see that it's actuall a dir.
//     var stat = await diskDatastore.statAsync(testDirPath);
//
//     assert.equal(stat.isDirectory(), true);
//
//     // now test existsAsync
//     assert.equal(await diskDatastore.existsAsync("/tmp"), true );
//
//     assert.equal(await diskDatastore.existsAsync("/tmpasdf"), false );
//
//     assert.equal(await diskDatastore.existsAsync("/home/burton/.polar/0xmissing"), false );
//
//     console.log("Worked");
//
// }
//
// async function testDiskDatastore() {
//
//     diskDatastore.init();
//     diskDatastore.init();
//     let fingerprint = "0x0000";
//     diskDatastore.sync(fingerprint, {});
//     var docMeta = await diskDatastore.getDocMeta(fingerprint)
//
//     // test for something that doesn't exits.
//     docMeta = await diskDatastore.getDocMeta("0xmissing")
//     assert.equal(docMeta, null)
//
// }
//
// testBasicFileOperations();
//
// testDiskDatastore();
// //
// //  test2();
// //
// //

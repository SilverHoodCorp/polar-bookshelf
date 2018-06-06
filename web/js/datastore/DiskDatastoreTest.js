const fs = require('fs');
const assert = require('assert');
const {DiskDatastore} = require("./DiskDatastore");
const metadata = require("../metadata/metadata");

var diskDatastore = new DiskDatastore();
var userHome = diskDatastore.getUserHome();

// FIXME: test teh async write functions...

assert.equal(userHome, "/home/burton");

async function testBasicFileOperations() {

    let testFilePath = "/tmp/test.write";
    let testDirPath = "/tmp/test.dir";

    // test removing files
    await diskDatastore.unlinkAsync(testFilePath)
                       .catch(function (err) {})
    await diskDatastore.rmdirAsync(testDirPath)
                       .catch(function (err) {console.error(err)})

    // test access

    var canAccess =
        await diskDatastore.accessAsync(testFilePath, fs.constants.R_OK | fs.constants.W_OK)
                       .then(() => true)
                       .catch(() => false);

    assert.equal(canAccess, false);

    // test writing
    await diskDatastore.writeFileAsync(testFilePath, "asdf", {});

    // now see if the file exists.

    var canAccess =
        await diskDatastore.accessAsync(testFilePath, fs.constants.R_OK | fs.constants.W_OK)
                           .then(() => true)
                           .catch(() => false);

    assert.equal(canAccess, true);

    // test reading
    var result = await diskDatastore.readFileAsync(testFilePath);
    assert.equal("asdf", result);

    // test removing files
    await diskDatastore.unlinkAsync(testFilePath);

    await diskDatastore.mkdirAsync(testDirPath)

    // now stat() the dir to see that it's actuall a dir.
    var stat = await diskDatastore.statAsync(testDirPath);

    assert.equal(stat.isDirectory(), true);

    // now test existsAsync
    assert.equal(await diskDatastore.existsAsync("/tmp"), true );

    assert.equal(await diskDatastore.existsAsync("/tmpasdf"), false );

    assert.equal(await diskDatastore.existsAsync("/home/burton/.polar/0xmissing"), false );

    console.log("Worked");

}

async function testDiskDatastore() {

    diskDatastore.init();
    diskDatastore.init();
    let fingerprint = "0x0000";
    diskDatastore.sync(fingerprint, {});
    var docMeta = await diskDatastore.getDocMeta(fingerprint)

    // test for something that doesn't exits.
    docMeta = await diskDatastore.getDocMeta("0xmissing")
    assert.equal(docMeta, null)

}

testBasicFileOperations();

testDiskDatastore();
//
//  test2();
//
//

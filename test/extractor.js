var extractor = require('../lib/extractor.js');
var fs = require('fs');

exports.testEmptySet = function (test) {
    test.throws(function () {extractor('nonexistentFile.css')});
    test.throws(function () {extractor()});
    test.done();
};

var testFileName = 'test/test.css';

exports.testEmptyFile = {
    setUp: function (cb) {
        fs.writeFile(testFileName, '', cb);
    },
    tearDown: function (cb) {
        fs.unlink(testFileName, cb);
    },
    emptyObject: function (test) {
        var result = extractor(testFileName),
            toS = Object.prototype.toString;

        test.deepEqual(result, {});
        test.equal(toS.call(result), toS.call({}));
        test.done();
    }
};

exports.testNonCssFile = {
    setUp: function (cb) {
        fs.writeFile(testFileName, 'xxxx---====yyy', cb);
    },
    tearDown: function (cb) {
        fs.unlink(testFileName, cb);
    },
    throwsError: function (test) {
        test.throws(function () { extractor(testFileName); });
        test.done();
    }
};

exports.testCssFile = {
    setUp: function (cb) {
        fs.writeFile(testFileName, '.xxx{color:red;}\n#yyy{background-color: navy}', cb);
    },
    tearDown: function (cb) {
        fs.unlink(testFileName, cb);
    },
    noError: function (test) {
        test.doesNotThrow(function () { extractor(testFileName); });
        test.done();
    },
    colorsCount: function (test) {
        var result = extractor(testFileName);
        test.equal(Object.keys(result).length, 2);
        test.done();
    }

};

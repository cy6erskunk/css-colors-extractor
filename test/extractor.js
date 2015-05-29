var extractor = require('../lib/extractor.js');

exports.noData = function (test) {
    test.throws(function () {extractor({})});
    test.throws(function () {extractor()});
    test.done();
};

exports.emptyData = {
    emptyObject: function (test) {
        var result = extractor(''),
            toS = Object.prototype.toString;

        test.deepEqual(result, {});
        test.equal(toS.call(result), toS.call({}));
        test.done();
    }
};

exports.invalidCssData = {
    throwsError: function (test) {
        test.throws(function () { extractor('xxxx---====yyy'); });
        test.done();
    }
};

var validData = '.xxx{color:red;}\n#yyy{background-color: navy}';

exports.validCssData = {
    noError: function (test) {
        test.doesNotThrow(function () { extractor(validData); });
        test.done();
    },
    colorsCount: function (test) {
        var result = extractor(validData);
        test.equal(Object.keys(result).length, 2);
        test.done();
    }

};

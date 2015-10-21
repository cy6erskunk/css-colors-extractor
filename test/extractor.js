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
    },
    doesNotThrow: function (test) {
        test.doesNotThrow(function () { extractor('xxx{padding:0;}'); });
        test.doesNotThrow(function () { extractor('xxx{border:none;}'); });
        test.done();
    }
};

var simpleValidData = '.xxx{color:#000;}';

exports.validCssData = {
    noError: function (test) {
        test.doesNotThrow(function () { extractor(simpleValidData); });

        test.done();
    },
    noImplicitAccumulation: function (test) {
        var result;
        result = extractor(simpleValidData);
        result = extractor(simpleValidData);

        test.equal(Object.keys(result).length, 1);
        test.equal(Object.keys(result).reduce(function (prev, curr) {
            return prev + result[curr].instances.length;
        }, 0), 1);
        test.done();
    },
    explicitAccumulation: function (test) {
        var result;
        result = extractor('.xxx{color:#000;}'); // 1
        result = extractor('.xxx{background-color:#111;}', result); // 2

        test.equal(Object.keys(result).length, 2);
        test.done();
    },
    colorsCount: function (test) {
        var result;
        result = extractor('.xxx {color:#000;}'); // 1
        result = extractor('.xxx {background-color:#111;}', result); // 2
        result = extractor('.xxx {border-color:#222;}', result); // 3
        result = extractor('.xxx {background:#333;}', result); // 4
        result = extractor('.xxx {border:1px solid #444;}', result); // 5
        result = extractor('.xxx {box-shadow: 0 0 0 0 #555;}', result); // 6
        result = extractor('.xxx {border-bottom: 1px solid #666;}', result); // 7
        test.equal(Object.keys(result).length, 7);

        test.done();
    }

};

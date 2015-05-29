var css = require('css'),
    Color = require('color'),
    createCustomError = require('custom-error-generator');

var colorObj = {};
var ColorParseError = createCustomError('ColorParseError');

/**
 * @typedef CssDataObject
 *
 * @prop {String} data
 * @prop {String} source
 */

/**
 * @param {String|CssDataObject} cssData
 * @param {Object} [objectToPatch] - write colors data to the provided object
 *
 * @throws {Error|ColorParseError} Throws error when cannot build AST or process stylesheet
 */
function processFile(cssData, objectToPatch) {
    var ast,
        source;

    if (typeof cssData !== 'string') {
        ast = css.parse(cssData.data, { source: cssData.source });
    } else {
        ast = css.parse(cssData);
    }

    if (typeof objectToPatch !== 'undefined') {
        colorObj = objectToPatch;
    }

    ast && processStylesheet(ast);

    return colorObj;
}

/**
 * @param {Object} dataChunk
 *
 * @throws Throws error when cannot process rules
 */
function processStylesheet(dataChunk) {
    (Object.keys(dataChunk.stylesheet) || []).forEach(function (stylesheetKey) {
        if (stylesheetKey === 'rules') {
            processRules(dataChunk.stylesheet[stylesheetKey]);
        }
    });
}

/**
 * @param {Object[]} rules
 *
 * @throws Throws error when cannot process declarations
 */
function processRules(rules) {
    rules = rules.filter(function (item) {
        return item.type === 'rule';
    });

    rules.forEach(function (rule) {
        if (! rule.declarations) {
            console.error('Empty declarations for rule: ', rule);
        } else if (rule.declarations.length) {
            processDeclarations(rule.declarations, rule.selectors);
        }
    });
}

/**
 * @param {Object[]} declarations
 * @param {String[]} selectors
 *
 * @throws Throws error when cannot parse value
 */
function processDeclarations(declarations, selectors) {
    declarations.forEach(function (decl) {
        var value;
        if (decl.type === 'declaration') {
            if (decl.property.indexOf('color') >= 0) {
                value = decl.value.toLowerCase();
                getColorsFromValue(value, decl, selectors);
            }
        }
    });
}

/**
 * @throws Throws error when cannot parse color string
 */
function getColorsFromValue(value, decl, selectors) {
    var colors = Object.keys(colorObj);

    function pushColorsWrapperFunc (v) {
        pushColors(v, selectors, decl);
    }

    function pushColors(v, selectors, decl) {
        var _v;

        try {
            _v = Color(v).rgbaString();
        } catch (e) {
            var error = new ColorParseError();

            error.value = v;
            error.line = decl.position.start.line;
            error.property = decl.property;
            error.origValue = decl.value;

            throw error;
        }

        if (!_v) {
            return;
        }

        if (colors.indexOf(_v) === -1) {
            colorObj[_v] = { instances: [], color: _v, colorArray: Color(v).rgbArray() };
            colors.push(_v);
        }

        colorObj[_v].instances.push({
            selectors: selectors,
            origProp: decl.property,
            origValue: decl.value,
            lineNumber: decl.position.start.line

        });
    }

    value = value.replace(/!important|inherit/g, '');

    if (value === 'transparent') {
        return;
    }

    var testRgba = value.match(/rgba\([^)]*\)/g);

    (testRgba || value.split(' '))
        .filter(function (v) { return v !== ''; })
        .forEach(pushColorsWrapperFunc);
}

processFile.ColorParseError = ColorParseError;

module.exports = processFile;

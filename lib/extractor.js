var css = require('css'),
    fs = require('fs');

var colorObj = {},
    _filename;

/**
 * @param {String} fileName
 * @param {Object} [objectToPatch] - write colors data to the provided object
 */
function processFile(fileName, objectToPatch) {
    var data = fs.readFileSync(fileName, { encoding: 'utf-8' }),
        ast = css.parse(data);

    _filename = fileName;

    if (typeof objectToPatch !== 'undefined') {
        colorObj = objectToPatch;
    }

    processStylesheet(ast);

    return colorObj;
}

/**
 * @param {Object} dataChunk
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

function getColorsFromValue(value, decl, selectors) {
    var colors = Object.keys(colorObj);

    function pushColorsWrapperFunc (v) {
        pushColors(v, selectors, decl);
    }

    function pushColors(v, selectors, decl) {
        if (colors.indexOf(v) === -1) {
            colorObj[v] = { instances: [], color: v };
            colors.push(v);
        }

        colorObj[v].instances.push({
            selectors: selectors,
            origProp: decl.property,
            origValue: decl.value,
            lineNumber: decl.position.start.line,
            fileName: _filename
        });
    }

    if (value === 'transparent') {
        return;
    }

    var testRgba = value.match(/rgba\([^)]*\)/g);

    (testRgba || value.split(' ')).forEach(pushColorsWrapperFunc);
}

module.exports = processFile;

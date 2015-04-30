var css = require('css');
var fs = require('fs');

fs.readFile('./main.css', { encoding: 'utf-8' }, function (err, data) {
    if (err) {
        console.err(err);
        return;
    }

    var ast = css.parse(data);
    processStylesheet(ast);
});

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
    // filter rules only
    rules = rules.filter(function (item) {
        return item.type === 'rule';
    });

    rules.forEach(function (rule) {
        processDeclarations(rule.declarations || []);
    });
}

function processDeclarations(declarations) {
    declarations.forEach(function (decl) {
        if (decl.type === 'declaration') {
            if (decl.property.indexOf('color') >= 0) {
                console.log(decl.value);
            }
        }
    });
}

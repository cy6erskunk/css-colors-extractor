var extractor = require('./lib/extractor.js');
var glob = require('glob');

var cwd = process.argv[2] || '.';
var fileNames;
var ignore = JSON.parse(process.argv[3] || '["node_modules/**/*.css"]');
console.log('cwd:', cwd);
console.log('ignore:', ignore);

glob("**/*.css", { cwd: cwd, ignore: ignore }, function (err, filenames) {
    fileNames = filenames.map(function (name) {
        return cwd + '/' + name;
    });
});

var express = require('express');
var app = express();
var port = 9999;

app.use(express.static(__dirname + '/static'));

app.get('/', function (req, res) {
    var colors = {},
        cwdRE = new RegExp('^' + cwd + '/');

    fileNames.forEach(function (filename) {
        console.log(filename);
        colors = extractor(filename, colors);
        Object.keys(colors).forEach(function (color) {
            colors[color].instances.forEach(function (instance) {
                instance.fileName = instance.fileName.replace(cwdRE, '');
            });
        });
    });

    res.render('index.jade', { colors: colors });
});

var server = app.listen(port, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('css-colors-extractor listening at http://%s:%s', host, port);

});

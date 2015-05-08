var extractor = require('./lib/extractor.js');
var glob = require('glob');

var cwd = process.argv[process.argv.length - 1];
var fileNames;
console.log(cwd);

glob("*.css", { cwd: cwd, matchBase: true }, function (err, filenames) {
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

    console.log('Example app listening at http://%s:%s', host, port);

});

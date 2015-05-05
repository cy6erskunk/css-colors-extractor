var extractor = require('./lib/extractor.js');
var glob = require('glob');

var paths = process.argv[process.argv.length - 1];
var fileNames;
console.log(paths);

glob("*.css", { cwd: paths, matchBase: true }, function (err, filenames) {
    fileNames = filenames.map(function (name) {
        return paths + '/' + name;
    });
});

var express = require('express');
var app = express();
var port = 9999;

app.use(express.static(__dirname + '/static'));

app.get('/', function (req, res) {
    var colors = {};
    fileNames.forEach(function (filename) {
        console.log(filename);
        colors = extractor(filename, colors);
    });

    res.render('index.jade', { colors: colors });
});

var server = app.listen(port, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

});

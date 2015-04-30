var fileName = './main.css';
var extractor = require('./lib/extractor.js');

var express = require('express');
var app = express();
var port = 9999;

app.use(express.static(__dirname + '/css'));

app.get('/', function (req, res) {
    var options = {
        colors: extractor(fileName)
    };

    res.render('index.jade', options);
});

var server = app.listen(port, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

});

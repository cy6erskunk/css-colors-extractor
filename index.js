var extractor = require('./lib/extractor.js');
var glob = require('glob');
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');

var config;

try {
    config = require('./.config.json');
} catch (e) {
    console.log('could not read config file');
}

var argv = require('yargs')
    .default('cwd', config && config.cwd || '.')
    .default('ignore', config && config.ignore || 'node_modules/**/*.css')
    .array('ignore')
    .alias('i', 'ignore')
    .argv;

var cwd = argv.cwd;
var ignore = argv.ignore;

console.log('cwd:', cwd);
console.log('ignore:', ignore);

var app = express();
var port = 9999;

app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/static'));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    var colors = {},
        cwdRE = new RegExp('^' + cwd + '/');

    glob("**/*.css", { cwd: cwd, ignore: ignore }, function (err, filenames) {
        filenames
            .map(function (name) {
                return cwd + '/' + name;
            })
            .forEach(function (filename) {
                try {
                    colors = extractor({ data: fs.readFileSync(filename, { encoding: 'utf-8' }), source: filename }, colors);
                } catch (e) {
                    if (e instanceof extractor.ColorParseError) {
                        console.error('Could not parse color "%s" @ %s:%s "%s: %s"', e.value, filename, e.line, e.property, e.origValue);
                    } else {
                        console.error('Doh!', e.message);
                    }
                }
                Object.keys(colors).forEach(function (color) {
                    colors[color].instances.forEach(function (instance) {
                        if (!instance.filename) {
                            instance.filename = filename.replace(cwdRE, '');
                        }
                    });
                });
            });

        var colorsArray = [];
        Object.keys(colors).forEach(function (key) {
            var color = colors[key];
            color.key = key;
            colorsArray.push(color);
        });

        res.render('index.jade', { colors: colorsArray.sort(function (a, b) {
            return a.hue > b.hue ? 1 : -1;
        })});
    });
});

app.get('/argv', function (req, res) {
    res.render('./views/argv.jade', { params: {
        cwd: cwd,
        ignore: ignore
    } });
});

app.post('/argv', function (req, res) {
    var config = req.body;

    if (!config) {
        res.status(400).send('empty config received');
    } else {
        try {
            fs.writeFileSync('.config.json', JSON.stringify(config), { encoding: 'utf8' });
            console.log('config saved');
            config.cwd && (cwd = config.cwd);
            config.ignore && (ignore = config.ignore);
            console.log('config reloaded');
        } catch (e) {
            res.status(500).send(e.message);
        }
        res.json(req.body);
    }
});

var server = app.listen(port, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('css-colors-extractor listening at http://%s:%s', host, port);

});

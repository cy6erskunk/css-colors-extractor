## Colors Extractor
[![Build Status](https://github.com/cy6erskunk/css-colors-extractor/actions/workflows/node.js.yml/badge.svg)](https://github.com/cy6erskunk/css-colors-extractor/actions/workflows/node.js.yml)

Run `index.js` and you get server which will recursively process all css files in provided dir and
display report when someone GETs `http://hostname:9999/`.

Options

    cwd     /path/to/folder/containing/css ('**/*.css' pattern is used to look for files)
            default: '.'
    ignore  pattern to exclude files from search. Might be used multiple times
            default: 'node_modules/**/*.css'


Examples:

    node index.js
    node index.js --cwd "/Users/user/web/resources/css" --ignore "**/*.min.css" -i "wat/wat.css" -i "jquery/**/*.css"

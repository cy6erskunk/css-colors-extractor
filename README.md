## Colors Extractor

Simplistic CLI.
Execute

    node index.js "/path/to/folder/containing/css" "['array', 'of', 'patterns', 'to', 'exclude']"

or

    node index.js "/path/to/folder/containing/css"

or
    node index.js

where last one means

    node index.js '.' '["node_modules/**/*.css"]'

and you'll launch server which will recursively process all css files in provided dir and
display report when someone GETs `http://hostname:9999/`

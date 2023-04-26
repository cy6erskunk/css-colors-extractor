const css = require("css");
const Color = require("color");
const createCustomError = require("custom-error-generator");

let colorObj;
const ColorParseError = createCustomError("ColorParseError");

/**
 * @typedef CssDataObject
 *
 * @prop {String} data
 * @prop {String} source
 */

/**
 * @typedef ColorInstance
 *
 * @prop selectors: selectors,
 * @prop {String} origProp - property from css
 * @prop {String} origValue - value from css
 * @prop {Number} lineNumber - css file line number
 */

/**
 * @typedef SingleColorObject
 *
 * @prop {Array} instances
 * @prop {String} color - rgba color string
 * @prop {Array} colorArray - rgbArray

/**
 * @typedef ColorObject
 *
 * @prop {SingleColorObject} - key is rgba string
 */

/**
 * @param {String|CssDataObject} cssData
 * @param {ColorObject} [objectToPatch] - write colors data to the provided object
 * @return {ColorObject}
 *
 * @throws {Error|ColorParseError} Throws error when cannot build AST or process stylesheet
 */
function processFile(cssData, objectToPatch) {
  let ast;
  let source;

  if (typeof cssData !== "string") {
    ast = css.parse(cssData.data, { source: cssData.source });
  } else {
    ast = css.parse(cssData);
  }

  if (typeof objectToPatch !== "undefined") {
    colorObj = objectToPatch;
  } else {
    colorObj = {};
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
    if (stylesheetKey === "rules") {
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
    return item.type === "rule";
  });

  rules.forEach(function (rule) {
    if (!rule.declarations) {
      console.error("Empty declarations for rule: ", rule);
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
    let value;
    const colorPropertyRegEx = /color|background|border|shadow/;
    if (decl.type === "declaration") {
      if (decl.property.match(colorPropertyRegEx)) {
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
  const colors = Object.keys(colorObj);

  function pushColorsWrapperFunc(v) {
    pushColors(v, selectors, decl);
  }

  function pushColors(v, selectors, decl) {
    let _v;

    try {
      _v = Color(v).rgbaString();
    } catch (e) {
      const error = new ColorParseError();
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
      colorObj[_v] = {
        instances: [],
        color: _v,
        colorArray: Color(v).rgbArray(),
        hue: Color(v).hue(),
      };
      colors.push(_v);
    }

    colorObj[_v].instances.push({
      selectors: selectors,
      origProp: decl.property,
      origValue: decl.value,
      lineNumber: decl.position.start.line,
    });
  }

  value = value.replace(/!important|inherit/g, "");

  if (value === "transparent") {
    return;
  }
  value = value.replace(/^ *| *$/g, "");

  const testRgba = value.match(/rgba?\([^)]*\)|#(:?[a-fA-F0-9]{3}){1,2}/g);
  const testColorName = value.match(/[a-zA-A]+/g);

  (
    testRgba ||
    testColorName?.filter(function (v) {
      return colors.indexOf(v) > -1;
    }) ||
    []
  ).forEach(pushColorsWrapperFunc);
}

const colors = [
  "black",
  "silver",
  "gray",
  "white",
  "maroon",
  "red",
  "purple",
  "fuchsia",
  "green",
  "lime",
  "olive",
  "yellow",
  "navy",
  "blue",
  "teal",
  "aqua",
  //extendedColors` array contains definitions of 147 extended css3 colors
  "aliceblue",
  "antiquewhite",
  "aqua",
  "aquamarine",
  "azure",
  "beige",
  "bisque",
  "black",
  "blanchedalmond",
  "blue",
  "blueviolet",
  "brown",
  "burlywood",
  "cadetblue",
  "chartreuse",
  "chocolate",
  "coral",
  "cornflowerblue",
  "cornsilk",
  "crimson",
  "cyan",
  "darkblue",
  "darkcyan",
  "darkgoldenrod",
  "darkgray",
  "darkgreen",
  "darkgrey",
  "darkkhaki",
  "darkmagenta",
  "darkolivegreen",
  "darkorange",
  "darkorchid",
  "darkred",
  "darksalmon",
  "darkseagreen",
  "darkslateblue",
  "darkslategray",
  "darkslategrey",
  "darkturquoise",
  "darkviolet",
  "deeppink",
  "deepskyblue",
  "dimgray",
  "dimgrey",
  "dodgerblue",
  "firebrick",
  "floralwhite",
  "forestgreen",
  "fuchsia",
  "gainsboro",
  "ghostwhite",
  "gold",
  "goldenrod",
  "gray",
  "green",
  "greenyellow",
  "grey",
  "honeydew",
  "hotpink",
  "indianred",
  "indigo",
  "ivory",
  "khaki",
  "lavender",
  "lavenderblush",
  "lawngreen",
  "lemonchiffon",
  "lightblue",
  "lightcoral",
  "lightcyan",
  "lightgoldenrodyellow",
  "lightgray",
  "lightgreen",
  "lightgrey",
  "lightpink",
  "lightsalmon",
  "lightseagreen",
  "lightskyblue",
  "lightslategray",
  "lightslategrey",
  "lightsteelblue",
  "lightyellow",
  "lime",
  "limegreen",
  "linen",
  "magenta",
  "maroon",
  "mediumaquamarine",
  "mediumblue",
  "mediumorchid",
  "mediumpurple",
  "mediumseagreen",
  "mediumslateblue",
  "mediumspringgreen",
  "mediumturquoise",
  "mediumvioletred",
  "midnightblue",
  "mintcream",
  "mistyrose",
  "moccasin",
  "navajowhite",
  "navy",
  "oldlace",
  "olive",
  "olivedrab",
  "orange",
  "orangered",
  "orchid",
  "palegoldenrod",
  "palegreen",
  "paleturquoise",
  "palevioletred",
  "papayawhip",
  "peachpuff",
  "peru",
  "pink",
  "plum",
  "powderblue",
  "purple",
  "red",
  "rosybrown",
  "royalblue",
  "saddlebrown",
  "salmon",
  "sandybrown",
  "seagreen",
  "seashell",
  "sienna",
  "silver",
  "skyblue",
  "slateblue",
  "slategray",
  "slategrey",
  "snow",
  "springgreen",
  "steelblue",
  "tan",
  "teal",
  "thistle",
  "tomato",
  "turquoise",
  "violet",
  "wheat",
  "white",
  "whitesmoke",
  "yellow",
  "yellowgreen",
];

processFile.ColorParseError = ColorParseError;

module.exports = processFile;

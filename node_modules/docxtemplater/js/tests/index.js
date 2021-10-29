"use strict";

require("es6-promise").polyfill();

var _require = require("./utils.js"),
    setExamplesDirectory = _require.setExamplesDirectory,
    setStartFunction = _require.setStartFunction,
    start = _require.start;

var path = require("path");

if (path.resolve) {
  setExamplesDirectory(path.resolve(__dirname, "..", "..", "examples"));
}

setStartFunction(startTest);

function startTest() {
  require("./base.js");

  require("./xml-templater.js");

  require("./xml-matcher.js");

  require("./errors.js");

  require("./speed.js");

  require("./lexer-parser-render.js");

  require("./integration.js");

  require("./doc-props.js");

  require("./modules.js");

  require("./doc-utils.js");
}

start();
"use strict";

function postrender(parts, options) {
  for (var i = 0, l = options.modules.length; i < l; i++) {
    var _module = options.modules[i];
    parts = _module.postrender(parts, options);
  }

  return options.joinUncorrupt(parts, options);
}

module.exports = postrender;
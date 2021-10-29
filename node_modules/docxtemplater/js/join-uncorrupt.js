"use strict";

var _require = require("./doc-utils.js"),
    endsWith = _require.endsWith,
    startsWith = _require.startsWith;

var filetypes = require("./filetypes.js");

function addEmptyParagraphAfterTable(parts) {
  var beforeSectPr = false;

  for (var i = parts.length - 1; i >= 0; i--) {
    var part = parts[i];

    if (startsWith(part, "<w:sectPr")) {
      beforeSectPr = true;
    }

    if (beforeSectPr) {
      var trimmed = part.trim();

      if (endsWith(trimmed, "</w:tbl>")) {
        parts.splice(i + 1, 0, "<w:p><w:r><w:t></w:t></w:r></w:p>");
        return parts;
      }

      if (endsWith(trimmed, "</w:p>")) {
        return parts;
      }
    }
  }

  return parts;
}

function joinUncorrupt(parts, options) {
  var contains = options.fileTypeConfig.tagShouldContain || []; // Before doing this "uncorruption" method here, this was done with the `part.emptyValue` trick, however, there were some corruptions that were not handled, for example with a template like this :
  //
  // ------------------------------------------------
  // | {-w:p falsy}My para{/falsy}   |              |
  // | {-w:p falsy}My para{/falsy}   |              |
  // ------------------------------------------------

  var collecting = "";
  var currentlyCollecting = -1;

  if (!options.basePart && filetypes.docx.indexOf(options.contentType) !== -1) {
    parts = addEmptyParagraphAfterTable(parts);
  }

  return parts.reduce(function (full, part) {
    for (var i = 0, len = contains.length; i < len; i++) {
      var _contains$i = contains[i],
          tag = _contains$i.tag,
          shouldContain = _contains$i.shouldContain,
          value = _contains$i.value;
      var startTagRegex = new RegExp("^(<(".concat(tag, ")[^>]*>)$"), "g");

      if (currentlyCollecting === i) {
        if (part === "</".concat(tag, ">")) {
          currentlyCollecting = -1;
          return full + collecting + value + part;
        }

        collecting += part;

        for (var j = 0, len2 = shouldContain.length; j < len2; j++) {
          var sc = shouldContain[j];

          if (part.indexOf("<".concat(sc, " ")) !== -1 || part.indexOf("<".concat(sc, ">")) !== -1) {
            currentlyCollecting = -1;
            return full + collecting;
          }
        }

        return full;
      }

      if (currentlyCollecting === -1 && startTagRegex.test(part)) {
        if (part[part.length - 2] === "/") {
          return full;
        }

        currentlyCollecting = i;
        collecting = part;
        return full;
      }
    }

    return full + part;
  }, "");
}

module.exports = joinUncorrupt;
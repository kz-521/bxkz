"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _require = require("./doc-utils.js"),
    getRightOrNull = _require.getRightOrNull,
    getRight = _require.getRight,
    getLeft = _require.getLeft,
    getLeftOrNull = _require.getLeftOrNull,
    chunkBy = _require.chunkBy,
    isTagStart = _require.isTagStart,
    isTagEnd = _require.isTagEnd,
    isContent = _require.isContent,
    last = _require.last,
    first = _require.first;

var _require2 = require("./errors.js"),
    XTTemplateError = _require2.XTTemplateError,
    throwExpandNotFound = _require2.throwExpandNotFound,
    getLoopPositionProducesInvalidXMLError = _require2.getLoopPositionProducesInvalidXMLError;

function lastTagIsOpenTag(tags, tag) {
  if (tags.length === 0) {
    return false;
  }

  var innerLastTag = last(tags).substr(1);
  return innerLastTag.indexOf(tag) === 0;
}

function getListXmlElements(parts) {
  /*
  Gets the list of closing and opening tags between two texts. It doesn't take
  into account tags that are opened then closed. Those that are closed then
  opened are kept
  	Example input :
  	[
  	{
  		"type": "placeholder",
  		"value": "table1",
  		...
  	},
  	{
  		"type": "placeholder",
  		"value": "t1data1",
  	},
  	{
  		"type": "tag",
  		"position": "end",
  		"text": true,
  		"value": "</w:t>",
  		"tag": "w:t",
  		"lIndex": 112
  	},
  	{
  		"type": "tag",
  		"value": "</w:r>",
  	},
  	{
  		"type": "tag",
  		"value": "</w:p>",
  	},
  	{
  		"type": "tag",
  		"value": "</w:tc>",
  	},
  	{
  		"type": "tag",
  		"value": "<w:tc>",
  	},
  	{
  		"type": "content",
  		"value": "<w:tcPr><w:tcW w:w="2444" w:type="dxa"/><w:tcBorders><w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/></w:tcBorders><w:shd w:val="clear" w:color="auto" w:fill="FFFFFF"/></w:tcPr>",
  	},
  	...
  	{
  		"type": "tag",
  		"value": "<w:r>",
  	},
  	{
  		"type": "tag",
  		"value": "<w:t xml:space="preserve">",
  	},
  	{
  		"type": "placeholder",
  		"value": "t1data4",
  	}
  ]
  	returns
  	[
  		{
  			"tag": "</w:t>",
  		},
  		{
  			"tag": "</w:r>",
  		},
  		{
  			"tag": "</w:p>",
  		},
  		{
  			"tag": "</w:tc>",
  		},
  		{
  			"tag": "<w:tc>",
  		},
  		{
  			"tag": "<w:p>",
  		},
  		{
  			"tag": "<w:r>",
  		},
  		{
  			"tag": "<w:t>",
  		},
  	]
  */
  var tags = parts.filter(function (_ref) {
    var type = _ref.type;
    return type === "tag";
  });
  var result = [];

  for (var i = 0; i < tags.length; i++) {
    var _tags$i = tags[i],
        position = _tags$i.position,
        value = _tags$i.value,
        tag = _tags$i.tag;

    if (position === "end") {
      if (lastTagIsOpenTag(result, tag)) {
        result.pop();
      } else {
        result.push(value);
      }
    } else if (position === "start") {
      result.push(value);
    } // ignore position === "selfclosing"

  }

  return result;
}

function has(name, xmlElements) {
  for (var i = 0; i < xmlElements.length; i++) {
    var xmlElement = xmlElements[i];

    if (xmlElement.indexOf("<".concat(name)) === 0) {
      return true;
    }
  }

  return false;
}

function getExpandToDefault(postparsed, pair, expandTags) {
  var parts = postparsed.slice(pair[0].offset, pair[1].offset);
  var xmlElements = getListXmlElements(parts);
  var closingTagCount = xmlElements.filter(function (tag) {
    return tag[1] === "/";
  }).length;
  var startingTagCount = xmlElements.filter(function (tag) {
    return tag[1] !== "/" && tag[tag.length - 2] !== "/";
  }).length;

  if (closingTagCount !== startingTagCount) {
    return {
      error: getLoopPositionProducesInvalidXMLError({
        tag: first(pair).part.value,
        offset: [first(pair).part.offset, last(pair).part.offset]
      })
    };
  }

  var _loop = function _loop(i, len) {
    var _expandTags$i = expandTags[i],
        contains = _expandTags$i.contains,
        expand = _expandTags$i.expand,
        onlyTextInTag = _expandTags$i.onlyTextInTag;

    if (has(contains, xmlElements)) {
      if (onlyTextInTag) {
        var left = getLeftOrNull(postparsed, contains, pair[0].offset);
        var right = getRightOrNull(postparsed, contains, pair[1].offset);

        if (left === null || right === null) {
          return "continue";
        }

        var chunks = chunkBy(postparsed.slice(left, right), function (p) {
          return isTagStart(contains, p) ? "start" : isTagEnd(contains, p) ? "end" : null;
        });
        var firstChunk = first(chunks);
        var lastChunk = last(chunks);
        var firstContent = firstChunk.filter(isContent);
        var lastContent = lastChunk.filter(isContent);

        if (firstContent.length !== 1 || lastContent.length !== 1) {
          return "continue";
        }
      }

      return {
        v: {
          value: expand
        }
      };
    }
  };

  for (var i = 0, len = expandTags.length; i < len; i++) {
    var _ret = _loop(i, len);

    if (_ret === "continue") continue;
    if (_typeof(_ret) === "object") return _ret.v;
  }

  return false;
}

function expandOne(part, index, postparsed, options) {
  var expandTo = part.expandTo || options.expandTo;

  if (!expandTo) {
    return postparsed;
  }

  var right, left;

  try {
    left = getLeft(postparsed, expandTo, index);
    right = getRight(postparsed, expandTo, index);
  } catch (rootError) {
    if (rootError instanceof XTTemplateError) {
      throwExpandNotFound(_objectSpread({
        part: part,
        rootError: rootError,
        postparsed: postparsed,
        expandTo: expandTo,
        index: index
      }, options.error));
    }

    throw rootError;
  }

  var leftParts = postparsed.slice(left, index);
  var rightParts = postparsed.slice(index + 1, right + 1);
  var inner = options.getInner({
    postparse: options.postparse,
    index: index,
    part: part,
    leftParts: leftParts,
    rightParts: rightParts,
    left: left,
    right: right,
    postparsed: postparsed
  });

  if (!inner.length) {
    inner.expanded = [leftParts, rightParts];
    inner = [inner];
  }

  return {
    left: left,
    right: right,
    inner: inner
  };
}

function expandToOne(postparsed, options) {
  var errors = [];

  if (postparsed.errors) {
    errors = postparsed.errors;
    postparsed = postparsed.postparsed;
  }

  var results = [];

  for (var i = 0, len = postparsed.length; i < len; i++) {
    var part = postparsed[i];

    if (part.type === "placeholder" && part.module === options.moduleName) {
      try {
        var result = expandOne(part, i, postparsed, options);
        i = result.right;
        results.push(result);
      } catch (error) {
        if (error instanceof XTTemplateError) {
          errors.push(error);
        } else {
          throw error;
        }
      }
    }
  }

  var newParsed = [];
  var currentResult = 0;

  for (var _i = 0, _len = postparsed.length; _i < _len; _i++) {
    var _part = postparsed[_i];
    var _result = results[currentResult];

    if (_result && _result.left === _i) {
      newParsed.push.apply(newParsed, _toConsumableArray(results[currentResult].inner));
      currentResult++;
      _i = _result.right;
    } else {
      newParsed.push(_part);
    }
  }

  return {
    postparsed: newParsed,
    errors: errors
  };
}

module.exports = {
  expandToOne: expandToOne,
  getExpandToDefault: getExpandToDefault
};
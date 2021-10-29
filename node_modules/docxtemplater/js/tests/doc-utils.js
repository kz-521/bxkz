"use strict";

var _require = require("../doc-utils.js"),
    uniq = _require.uniq;

var _require2 = require("./utils.js"),
    expect = _require2.expect;

describe("Uniq", function () {
  it("should work", function () {
    expect(uniq(["a", "b", "a"])).to.deep.equal(["a", "b"]);
  });
});
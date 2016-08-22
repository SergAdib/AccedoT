(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setMovObjCollection = setMovObjCollection;

var _Movobj = require('./Movobj');

/*
 * @Exports set of Movie instances
 *
 * Imports Movie Objects from remote instance / uri
 * by parsing JSON data to Objects; or from DB (accedot -> "MovieList" collection)
 */

function setMovObjCollection(link, db) {
  if (!link) return null;
  var data = [];
  if (db === true) {
    data = new movieFromDB(link);
  } else {
    data = new movieFromAJAX(link);
  }
  return data;
}

/*
 * Helper functions for data parsing
 *
 */

function movieFromAJAX(link) {
  var rowdata = [];
  var i = void 0,
      obj = void 0;
  $.getJSON(link, function (data) {
    for (i = 0; i < data.totalCount; i++) {
      obj = new _Movobj.createMovObj(data.entries[i]);
      rowdata.push(obj);
    }
  });
  return rowdata;
}

function movieFromDB(query) {
  var rowdata = [];

  return rowdata;
}
},{"./Movobj":3}],2:[function(require,module,exports){
'use strict';

var _Importobj = require('./Importobj');

var find = new _Importobj.setMovObjCollection("http://demo2697834.mockable.io/movies", false);

function makeRows() {
  var i = 0;
  var j = '';
  for (i = 0; i < 10; i++) {
    j += "counting...";
  }return j;
}

$("p#here").text(makeRows());
console.log(makeRows());
console.log(find);
},{"./Importobj":1}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMovObj = createMovObj;
/*
 * @Exports simple object of Movie instance
 *
 * Creates a simple Movie Object with given (data)
 * or by default if no / not full data provided
 */

function createMovObj(data) {
  if (!data) data = [];
  this.title = data.title || "Movie title";
  this.description = data.description || "Movie description goes here";
  this.type = data.type || "Movie type";
  this.PD = data.publishedDate ? new Date(data.publishedDate).toDateString() : new Date().toDateString();
  this.AD = data.availableDate ? new Date(data.availableDate).toDateString() : new Date().toDateString();
  this.meta = [];
  if (!data.metadata || data.metadata.length === 0) {
    var _obj = {};
    _obj.value = "en";
    _obj.name = "language";
    this.meta.push(_obj);
  } else {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = data.metadata[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var obj = _step.value;
        this.meta.push(obj);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }this.contents = [];
  if (!data.contents || data.contents.length === 0) {
    var _obj2 = {};
    _obj2.uri = "#";
    _obj2.format = "Video";
    _obj2.width = 0;
    _obj2.height = 0;
    _obj2.lang = "en";
    _obj2.duration = 0;
    _obj2.geoLock = false;
    _obj2.id = "Video id";
    this.contents.push(_obj2);
  } else {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = data.contents[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var obj = _step2.value;
        this.contents.push(obj);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  }this.credits = [];
  if (data.credits) {
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = data.credits[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var obj = _step3.value;

        if (obj.role === obj.name) obj.role = "Starring";
        this.credits.push(obj);
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }
  }
  this.parentalRatings = [];
  if (data.parentalRatings) {
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = data.parentalRatings[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var obj = _step4.value;
        this.parentalRatings.push(obj);
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4.return) {
          _iterator4.return();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }
  }
  this.images = [];
  if (!data.images || data.images.length === 0) {
    var _obj3 = {};
    _obj3.type = "cover";
    _obj3.uri = "#";
    _obj3.width = 0;
    _obj3.height = 0;
    _obj3.id = "Image id";
    this.images.push(_obj3);
  } else {
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = data.images[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var obj = _step5.value;
        this.images.push(obj);
      }
    } catch (err) {
      _didIteratorError5 = true;
      _iteratorError5 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5.return) {
          _iterator5.return();
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5;
        }
      }
    }
  }this.categories = [];
  if (!data.categories || data.categories.length === 0) {
    var _obj4 = {};
    _obj4.title = "Movie";
    _obj4.description = "Just movie";
    _obj4.id = "Category id";
    this.categories.push(_obj4);
  } else {
    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
      for (var _iterator6 = data.categories[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
        var obj = _step6.value;
        this.categories.push(obj);
      }
    } catch (err) {
      _didIteratorError6 = true;
      _iteratorError6 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion6 && _iterator6.return) {
          _iterator6.return();
        }
      } finally {
        if (_didIteratorError6) {
          throw _iteratorError6;
        }
      }
    }
  }this.id = data.id || "Movie id";
  return this;
}
},{}]},{},[2]);

//# sourceMappingURL=Build.js.map

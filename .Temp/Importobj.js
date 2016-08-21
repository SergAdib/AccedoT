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
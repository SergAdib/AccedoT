import {createMovObj} from './Movobj'
/*
 * @Exports set of Movie instances
 *
 * Imports Movie Objects from remote instance / uri
 * by parsing JSON data to Objects; or from DB (accedot -> "MovieList" collection)
 */

export function setMovObjCollection (link, db) {
  if (!link) return null;
  let data = [];
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
  let rowdata = [];
  let i, obj;
  $.getJSON(link, function(data) {
    for (i=0; i<data.totalCount; i++) {
      obj = new createMovObj(data.entries[i]);
      rowdata.push(obj);
    }
  });
  return rowdata;
}

function movieFromDB(query) {
  let rowdata = [];

  return rowdata;
}

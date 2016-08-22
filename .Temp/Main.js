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
import {setMovObjCollection} from './Importobj'

var find = new setMovObjCollection("http://demo2697834.mockable.io/movies", false);

function makeRows() {
  let i = 0;
  let j = '';
  for (i=0; i<10; i++) j+= "counting..."
  return j;
}


//$("#here").text(makeRows(find));
console.log(makeRows(find));
console.log(find);

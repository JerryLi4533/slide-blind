// One-time editorial image assignment for the sample-based edition.
import { readFile, writeFile } from 'node:fs/promises';
const path = new URL('../src/new-decks.mjs',import.meta.url);
const assignments = {
 'monday-relativity': {0:'image201',2:'image131',4:'image143',5:'image102'},
 'elevator-control': {0:'image202',2:'image101',3:'image99',4:'image110',5:'image107'},
 'fridge-archaeology': {0:'image203',2:'image207',3:'image113',4:'image208'},
 'parcel-epic': {0:'image204',2:'image153',4:'image54',5:'image112'},
 'received-quantum': {0:'image205',1:'image106',2:'image84',4:'image103',5:'image109'},
 'shower-board': {0:'image206',3:['image35','image99'],4:'image98',5:'image104'}
};
let deck, index;
const lines=(await readFile(path,'utf8')).split('\n').map(line=>{
 const match=line.match(/^\{id:'([^']+)'/);
 if(match){deck=match[1];index=0;}
 if(!line.startsWith(' S('))return line;
 const value=assignments[deck]?.[index++];
 if(!value)return line;
 if(Array.isArray(value)) {
  const field=`images:${JSON.stringify(value)}`;
  return /images:\[[^\]]*\]/.test(line)?line.replace(/images:\[[^\]]*\]/,field):line.replace(',{',`,{${field},`);
 }
 return /image:'image\d+'/.test(line)?line.replace(/image:'image\d+'/,`image:'${value}'`):line.replace(',{',`,{image:'${value}',`);
});
await writeFile(path,lines.join('\n'),'utf8');

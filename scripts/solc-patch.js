let fs = require('fs');
fs.readFile('node_modules/solc/soljson.js', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/Uint8Array/g, 'Uint16Array');

  fs.writeFile('node_modules/solc/soljson.js', result, 'utf8', function (err) {
    if (err) {
      return console.log(err);
    } 
    else {
      console.log('solc-js patched');
    }
  });
});
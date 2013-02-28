var file = require('fs');

getParsedjson = function(fileName, createOptions) {
  
  file.readFile(fileName, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    parsed = JSON.parse(data);
    createOptions(parsed);
  });
}

exports.getParsedjson = getParsedjson;
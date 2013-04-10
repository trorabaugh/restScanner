var file = require('fs');

getParsedjson = function(fileName, createOptions, id) {
  
  file.readFile(fileName, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    parsed = JSON.parse(data);
    createOptions(parsed, id);
  });
}

exports.getParsedjson = getParsedjson;
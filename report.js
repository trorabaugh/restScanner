var fs = require('fs');

var startReport = function(reportObj){
  console.log(reportObj);
  var str = '';
  for(var i=0; i<reportObj.length; i++){
    str += reportObj[i] + " ";
  }
  str += "\r\n";
  fs.appendFileSync('log.txt', str, 'utf8', function (err) {
    console.log("error writing file");
  });
}

exports.startReport = startReport;
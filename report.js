var fs = require('fs');

var logStream = fs.createWriteStream('log.txt', {flags:'a'});

var startReport = function(reportObj){
  console.log(reportObj);
  var str = '';
  for(var i=0; i<reportObj.length; i++){
    str += reportObj[i] + " ";
  }
  str += "\r\n";
  logStream.write(str);
}

exports.startReport = startReport;
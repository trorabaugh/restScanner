var fs = require('fs');

var logStream = fs.createWriteStream('log.txt', {flags:'a'});

var startReport = function(reportObj, id){
  console.log(reportObj);
  //console.log(id);
  var str = '';
  for(var i=0; i<reportObj.length; i++){
    str += reportObj[i] + " ";
  }
  str += "\r\n";
  if(id == -1){
    logStream.write(str);
  } else {
    var file = "./views/" + id
    var logStream = fs.createWriteStream(file, {flags:'a'});
    logStream.write(str);
    console.log("this is rest report");
  }
}

exports.startReport = startReport;
var file = require('fs');

var giveDataAttack = function(httpData, attackName){
  //console.log(attackList)
  var url = require('./urlUtil.js');
  file.readFile('./Attack/manifest.json', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    parsed = JSON.parse(data);
    console.log(parsed);
    //var attackStr = Object.keys(parsed);
    //if(attackName == 'appexp'){
    var attackFile = './Attack/' + parsed[attackName];
      var attack = require(attackFile);
      for(var httpDataLength=0; httpDataLength<httpData.length; httpDataLength++){
        console.log("HTTP Data URL is:"+httpData[httpDataLength].path);
	      var attackSend = attack.executeAttack(httpData[httpDataLength]);
      }
    //}
  });
}
exports.giveDataAttack = giveDataAttack;
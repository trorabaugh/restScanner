/*
	This is attack loading page

*/
var file = require('fs');

/*
	This method calls executeAttack module
	@@Input: httpData object, attack name
	@@Output: executeFunction of an attack
*/
var giveDataAttack = function(httpData, attackName){
 
  var url = require('./urlUtil.js');
  file.readFile('./Attack/manifest.json', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    parsed = JSON.parse(data);
    console.log(parsed);
   
    //As of now, its hard-coded path
    var attackFile = './Attack/' + parsed[attackName];
	
      var attack = require(attackFile);
      for(var httpDataLength=0; httpDataLength<httpData.length; httpDataLength++){
       
	      var attackSend = attack.executeAttack(httpData[httpDataLength]);
      }
    
  });
}
exports.giveDataAttack = giveDataAttack;
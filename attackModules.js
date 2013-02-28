var giveDataAttack = function(httpData){
  console.log(httpData)
  var url = require('./urlUtil.js');
  var appException = require('./appexception.js');
  for(var httpDataLength=0;httpDataLength<httpData.length;httpDataLength++){
  console.log("HTTP Data URL is:"+httpData[httpDataLength].path);
	var attackSend = appException.executeAttack(httpData[httpDataLength]);}
 }
exports.giveDataAttack = giveDataAttack;
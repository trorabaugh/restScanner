/*
	REST Style Scanner
	Author: Gaurav Pawaskar
			Rohit Pitke

	This is landing page which takes argument as attack name as mentioned in manifest file
	Method to call: node main.js <attack_string>

*/


var url = require('./urlUtil.js');
var parsejson = require('./readJson.js');
var attackModules = require('./attackModules.js');
var attackName = process.argv[2];
var attackData = process.argv[3];

/*
	This function checks whether main.js is called with corrrect paramaters
	@@Input: attack list loaded in manifest.js
	@@output: Validation logic


*/
var selectAttack = function(attackList) {
  
  if(attackName == undefined){
    console.log("You did not enter attack name");
    process.exit(1);
  } else {
    var attackStr = Object.keys(attackList);
    var attackFound = 0;
    for(var i=0; i<attackStr.length; i++){
      if(attackStr[i] == attackName){
        attackFound = 1;
      }
    }
    if(attackFound == 0){
      console.log("Attack Not found Possible attack Strings are:");
      console.log(attackStr);
      process.exit(1);
    } else {
      
      var parsedJson = parsejson.getParsedjson('input.json', createOptions);
    }
  }
}


/*
	This method is called from selectAttack
	@@Input: This method parses URL objects, converts it to node options

*/
var createOptions = function(parsedJson) {
  urlObjs = url.createJsonUrl(parsedJson);
  
  var httpData = [];
  for(var i=0; i<urlObjs.length; i++){
    var temp = new Object();
    temp.URL = parsedJson.data[i].URL;
    temp.method = parsedJson.data[i].method;
    temp.HTTPHeader = parsedJson.data[i].HTTPHeader;
    temp.protocol = urlObjs[i].protocol;
    temp.path = urlObjs[i].path;
    temp.host = urlObjs[i].host;
    temp.auth = urlObjs[i].auth;
    temp.hostname = urlObjs[i].hostname;
    temp.port = urlObjs[i].port;
    temp.pathname = urlObjs[i].pathname;
    temp.pathvalues = urlObjs[i].pathname.split("/");
    
    temp.query = [];
    if(parsedJson.data[i].method == 'GET'){
      var keys = Object.keys(urlObjs[i].query);
      for(var j=0; j<keys.length; j++){
        var query = new Object();
        query.name = keys[j];
        query.value = urlObjs[i].query[keys[j]];
        query.seperator = '=';
        temp.query.push(query);
      }
    } else if(parsedJson.data[i].method == 'POST'){
      var keys = Object.keys(parsedJson.data[i].body);
      for(var j=0; j<keys.length; j++){
        var query = new Object();
        query.name = keys[j];
        query.value = parsedJson.data[i].body[keys[j]];
        query.seperator = '=';
        temp.query.push(query);
      }
    }
    httpData.push(temp);
  }
  
  //Attacker module
  attackModules.giveDataAttack(httpData, attackName);
}



attackList = parsejson.getParsedjson('./Attack/manifest.json', selectAttack);
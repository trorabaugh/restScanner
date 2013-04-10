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
var attackData = '';
var restCall = 0;

/*
	This function checks whether main.js is called with corrrect paramaters
	@@Input: attack list loaded in manifest.js
	@@output: Validation logic


*/
var selectAttack = function(attackList, id) {

  console.log(id);
  if(attackName == undefined){
    console.log(restCall);
    console.log("You did not enter attack name");

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
    } else {
      if(restCall == 1){
        var parsedJson = JSON.parse(attackData);
        createOptions(parsedJson, id);
      } else {
        var parsedJson = parsejson.getParsedjson('input.json', createOptions, id);
      }
    }
  }
}


/*
	This method is called from selectAttack
	@@Input: This method parses URL objects, converts it to node options

*/
var createOptions = function(parsedJson, id) {
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
  //Attack Module
  attackModules.giveDataAttack(httpData, attackName, id);
}

/*
  This method is to start when project is run as rest. Called from rest.js
  @@input: attack name as string, json data attack details, and attack id to 
    generate report.
*/
var startMain = function(attack, attackJson, id){
  attackName = attack;
  restCall = 1;
  attackData = attackJson;
  attackList = parsejson.getParsedjson('./Attack/manifest.json', selectAttack, id);
}


/*
  This method is start when project is called from command line using main.js
*/
var main = function(){
    attackList = parsejson.getParsedjson('./Attack/manifest.json', selectAttack, -1);
}

if (require.main === module) {
    main();
}

exports.startMain = startMain;
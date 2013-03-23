var url = require('./urlUtil.js');
var parsejson = require('./readJson.js');
var attackModules = require('./attackModules.js');
var attackName = process.argv[2];
//var attackList = {};

var selectAttack = function(attackList) {
  console.log(attackList);
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
      //console.log(attackList);
      var parsedJson = parsejson.getParsedjson('input.json', createOptions);
    }
  }
}

var createOptions = function(parsedJson) {
  urlObjs = url.createJsonUrl(parsedJson);
  //console.log(urlObjs);
  //console.log(parsedJson);
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
    //console.log("path values: " + urlObjs[i].pathname.split("/").join("/"));
    //var tp = urlObjs[i].pathname.split("/");
    //console.log(tp[1]);
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
  //console.log(httpData);
  //console.log(attackList);
  attackModules.giveDataAttack(httpData, attackName);
}

attackList = parsejson.getParsedjson('./Attack/manifest.json', selectAttack);
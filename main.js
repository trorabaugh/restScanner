var url = require('./urlUtil.js');
//var httpReq = require('./sendReq.js');
var parsejson = require('./readJson.js');
var attackModules = require('./attackModules.js');

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
  attackModules.giveDataAttack(httpData);
}

var parsedJson = parsejson.getParsedjson('input.json', createOptions);

//responseCallback = function(response){
  //console.log(response)
//}

//urlObj = new Object();
//urlObj = url.parse("http://google.com/a/b?x=1&y=2");
//urlObj.host = "www.yahoo.com"
//console.log(urlObj.host);
//console.log(url.recreate(urlObj));
/*Object.keys(parsedJson.data[1].body).forEach(function(key){
    console.log(parsedJson.data[1].body[key])
    });
  */
//var options = {
//  host: urlObj.host,
//  path: urlObj.path
//};
//httpReq.sendReq(options, responseCallback);
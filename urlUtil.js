var url = require('url');
var querystring = require('querystring');

var parse = function (fullUrl){
  urlObj = new Object();
  var parsedUrl = url.parse(fullUrl, true);
  urlObj.protocol = parsedUrl.protocol;
  urlObj.path = parsedUrl.path;
  urlObj.host = parsedUrl.host;
  urlObj.auth = parsedUrl.auth;
  urlObj.hostname = parsedUrl.hostname;
  urlObj.port = parsedUrl.port;
  urlObj.pathname = parsedUrl.pathname;
  urlObj.query = parsedUrl.query;
  return urlObj;
}

var  recreateUrl = function (httpData){
    
		var options = {};
    httpData.pathname = httpData.pathvalues.join("/");
    //console.log(httpData);
    options = {
      host : httpData.host,
      hostname : httpData.hostname,
      port : httpData.port,
      method : httpData.method,
      path : '',
      auth : httpData.auth,
      headers : httpData.HTTPHeader,
  };
  if (httpData.method == 'GET'){
    tempPath = httpData.pathname + '?';
    //console.log(httpData.query.length);
    for(var i=0; i<httpData.query.length; i++){
      tempPath = tempPath + httpData.query[i].name + httpData.query[i].seperator + httpData.query[i].value;
      if(i < (httpData.query.length - 1)){
        tempPath = tempPath + '&';
      }
    }
    options.path = tempPath;
  } else if (httpData.method == 'POST'){
    tempPath = httpData.pathname
    tempBody = '';
    for(var i=0; i<httpData.query.length; i++){
      tempBody = tempBody + httpData.query[i].name + httpData.query[i].seperator + httpData.query[i].value;
      if(i < (httpData.query.length - 1)){
        tempBody = tempBody + '&';
      }
    }
    options.path = tempPath;
    options.body = tempBody;
  }
	
	var newTemp = {};
	newTemp.prototype = options;
  return options;
}

var createJsonUrl = function (parsedJson){
  var urlObjs = [];
  for(var i = 0; i < parsedJson.data.length; i++){
    urlObjs.push(parse(parsedJson.data[i].URL));
  }
  return urlObjs;  
}

exports.parse = parse;
exports.recreateUrl = recreateUrl;
exports.createJsonUrl = createJsonUrl;
var http = require('http');
var fs = require('fs');

callback = function(response) {
  var str = '';
  response.setEncoding('utf8');
  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  //the whole response has been recieved, so we just print it out here
  response.on('end', function () {
    responseCallback(str)
  });
}
   
var sendReq = function (options, responseCallback){
  http.request(options, callback).end();
}

exports.sendReq = sendReq;
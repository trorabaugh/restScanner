/*
	This is SQL Injection attack module
	This tries to find Database Error Messages. Blind, Union, Time based SQL Injections are not yet detected


*/

var url = require('../urlUtil.js');
var http = require('http');
var issueDetection = require('../performInfectionDetection.js');
var vulnURLsArray = [];

//This is injection list
var injectableList = ['*', ';','~','%2527','AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa','||','<>','-/@#$','^','!','@','<!-->','<TestId>','[]'];

//This is detection list
var detectionArray = ['Fatal error','exception','stack trace','(.*\\bERROR\\b.*)\\r?\\n(.*\\r?\\n)*(.*\\bat\\b.*)*(\\d{1,4}\\)\\r?\\n)','Server Error'];

var executeAttack = function(httpDataObject){
  for(var i=0; i<httpDataObject.query.length; i++){
    for(var j=0;j<injectableList.length;j++){
		
      var originalValue = httpDataObject.query[i].value;
			httpDataObject.query[i].value = injectableList[j];
			var urlNew = url.recreateUrl(httpDataObject);
			
			var vulnField = httpDataObject.query[i].name;
			urlNew["field"] = vulnField;      //Need to access this sometime later
			
			vulnURLsArray.push(urlNew);
			httpDataObject.query[i].value = originalValue;
			}
    }
   
			//Execute attack requests

		for(var index=0;index<vulnURLsArray.length;index++){
			(function(urlObject){
        
				if(urlObject.method == 'GET'){
				  http.request(urlObject, function(res){
					  res.setEncoding('utf8');
					  var str = '';
					  res.on('data', function (chunk) {
						  str += chunk;
            });
					
					  res.on('end', function () {
					    for(var detectionIndex = 0;detectionIndex<detectionArray.length;detectionIndex++){
						    var regExp = new RegExp(detectionArray[detectionIndex]);
						    if(str.match(regExp))
							    console.log("infection found for path:"+urlObject.path+"For field:"+urlObject.field);   /*Here is issue. urlNew is always last urlNew that was updated. So we need new name everytime*/
    					}
					  });
					  res.on('error',function(err){
					    console.log("Error while getting response.Error was:"+err);
					  });
					}).end();
				} else if(urlObject.method == 'POST'){
      
            var req = http.request(urlObject, function(res){
					    res.setEncoding('utf8');
					    var str = '';
					    res.on('data', function (chunk) {
						    str += chunk;
              });
					
					    res.on('end', function () {
              
                if(issueDetection.performInfectionDetectionOnResponse(detectionArray,str))
                   console.log("infection found for path:"+urlObject.path+"For field:"+urlObject.field);   /*Here is issue. urlNew is always last urlNew that was updated. So we need new name everytime*/
                });
                /*
					      for(var detectionIndex = 0;detectionIndex<detectionArray.length;detectionIndex++){
						      var regExp = new RegExp(detectionArray[detectionIndex]);
                
						      if(str.match(regExp))
						        console.log("infection found for path:"+urlObject.path+"For field:"+urlObject.field);   
		            }*/
					    //});
					    res.on('error',function(err){
					      console.log("Error while getting response.Error was:"+err);
					    });
          
           
				    });
            req.write(urlObject.body);
            req.end();
        }
     })(vulnURLsArray[index]);
  }
}
exports.executeAttack = executeAttack;

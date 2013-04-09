/*
	This is SQL Injection attack module
	This tries to find Database Error Messages. Blind, Union, Time based SQL Injections are not yet detected


*/

var url = require('../urlUtil.js');
var report = require('../report.js');
var http = require('http');
var vulnURLsArray = [];
var injectableList = ['*', '\'','"','@@version','-- -','#','?','union select 1 from dual','%00','%2527','%84','||',')(','{}','\'OR','&&'];		//This array is injection list
//This is detection list
var detectionArray = ['error occured',
					 'error in your SQL syntax',
					 'DB2 SQL error',
					 'Microsoft ODBC',
					 'mySQL error with query',
					 'Microsoft OLE DB Provider for ODBC Drivers error',
					 'Unterminated string constant',
					 'SQL error or missing database',
					 'PDOException:',
					 'mysql_fetch_array()',
					 'Access Database Engine',
					 'Warning.sybase'
					 ];	

//Every attack must implement executeAttack
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
    
	for(var index=0;index<vulnURLsArray.length;index++){
	
	//JS IIFE. This has to be done as we wanted to preserve request objects
	(function(urlObject, index){
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
				if(str.match(regExp)){
					console.log("infection found for path:"+urlObject.path+"For field:"+urlObject.field);   /*Here is issue. urlNew is always last urlNew that was updated. So we need new name everytime*/
                }
    					
				}});
			
			res.on('error',function(err){
				console.log("Error while getting response.Error was:"+err);
				});
				}).end();
				} 
				
		 else if(urlObject.method == 'POST'){
            
			var req = http.request(urlObject, function(res){
						res.setEncoding('utf8');
					    var str = '';
					    res.on('data', function (chunk) {
						    str += chunk;
              });
					
					    res.on('end', function () {
					      for(var detectionIndex = 0;detectionIndex<detectionArray.length;detectionIndex++){
						      var regExp = new RegExp(detectionArray[detectionIndex]);
                 // console.log(str);
						      if(str.match(regExp))
						        console.log("infection found for path:"+urlObject.path+"For field:"+urlObject.field);   /*Here is issue. urlNew is always last urlNew that was updated. So we need new name everytime*/
		            }
					    });
					    res.on('error',function(err){
					      console.log("Error while getting response.Error was:"+err);
					    });
            //  console.log(urlObject.body);
           
				    });
            req.write(urlObject.body);
            req.end();
        }
     })(vulnURLsArray[index], index);
  }
}

exports.executeAttack = executeAttack;

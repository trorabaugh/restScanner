var url = require('../urlUtil.js');
var report = require('../report.js');
var http = require('http');
var vulnURLsArray = [];
var injectableList = ['*', '\'','"'];
var detectionArray = ['error occured','error in your SQL syntax'];

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
    //console.log(vulnURLsArray);
			//Execute attack requests
    //var reportObj = [];
		for(var index=0;index<vulnURLsArray.length;index++){
			//console.log("I am injecting URL as:"+vulnURLsArray[index].path);
			(function(urlObject, index){
        
				if(urlObject.method == 'GET'){
      //  console.log(urlObject);
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
                  var reportTuple = [];
                  reportTuple.push(urlObject.path);
                  reportTuple.push(urlObject.field);
                  //reportObj.push(reportTuple);
                  //console.log(reportObj);
                  console.log(index);
                  report.startReport(reportTuple);
							    //console.log("infection found for path:"+urlObject.path+"For field:"+urlObject.field);   /*Here is issue. urlNew is always last urlNew that was updated. So we need new name everytime*/
                }
    					}
					  });
					  res.on('error',function(err){
					    console.log("Error while getting response.Error was:"+err);
					  });
					}).end();
				} else if(urlObject.method == 'POST'){
       // console.log(urlObject);
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

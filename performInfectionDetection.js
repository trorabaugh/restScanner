var performInfectionDetectionOnResponse = function(detectionArray,responseData){
    for(var detectionIndex = 0;detectionIndex<detectionArray.length;detectionIndex++){
        var regExp = new RegExp(detectionArray[detectionIndex]);
				if(responseData.match(regExp))
          return 1;
        else
          return 0;
    }
};
exports.performInfectionDetectionOnResponse = performInfectionDetectionOnResponse;
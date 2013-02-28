var http = require('http');
var array = ['10','11','12','13','14'];
for(var i=0; i<5; i++){
    (function(key) {
        http.get("http://www.google.com", function(res){
            console.log(array[key])
        });
    })(i);
}

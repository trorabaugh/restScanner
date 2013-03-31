var express = require('express')
  , childprocess = require ('child_process')
  , http = require('http');

var app = express();
var children = [];

app.configure(function(){
  app.set('port', process.env.PORT || 80);
  app.use(express.bodyParser());
});

app.get("/", function(req, res){
  res.send("Need to send post");
});

app.post("/", function(req, res){
  //console.log("post " + JSON.stringify(req.body));
  var input = JSON.stringify(req.body);
  var args = ["sqli", input];
  var child = childprocess.fork(__dirname + "/main.js", args);
  children.push(child);
  child.on("exit", function(){
    console.log("Result should be ready");
  });
  //res.send("post " + JSON.stringify(req.body));
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("listening");
});

process.on("exit", function(){
  children.forEach(function(child){
    console.log("killing child");
    child.kill();
  });
});
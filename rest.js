var express = require('express')
  , main = require('./main.js')
  , childprocess = require ('child_process')
  , http = require('http');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 80);
  app.use(express.bodyParser());
});

app.get("/", function(req, res){
  res.send("Need to send post");
});

app.post("/:attack", function(req, res){
  //console.log("post " + JSON.stringify(req.body));
  var input = JSON.stringify(req.body);
  main.startMain(req.params.attack, input);
  res.end();
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("listening");
});
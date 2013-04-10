var express = require('express')
  , main = require('./main.js')
  , file = require('fs')
  , http = require('http');

var app = express();
var id = 0;

app.configure(function(){
  app.set('port', process.env.PORT || 80);
  app.use(express.bodyParser());
});

app.get("/", function(req, res){
  res.send("Need to send post");
});

app.post("/attack/:attack", function(req, res){
  //console.log("post " + JSON.stringify(req.body));
  var input = JSON.stringify(req.body);
  id++;
  main.startMain(req.params.attack, input, id);
  res.end("" + id);
});

app.get("/report/:id", function(req, res){
  //console.log(req.params.id);
  file.readFile('./views/' + req.params.id, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
      res.send("error loading report");
    } else {
      var temp = data.split("\r\n");
      console.log(temp.length);
      res.render("report.jade", {'data': temp});
    }
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("listening");
});
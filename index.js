var fs = require('fs');

var buf = fs.readFileSync('index.html');
buf = buf.toString()
var express = require('express')
var app = express();

app.set('port', (process.env.PORT ||8080))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send(buf)
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})


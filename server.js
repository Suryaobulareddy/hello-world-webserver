var http = require('http');
var os = require('os');

var macs = ()=>{
  return JSON.stringify(  os.networkInterfaces(),  null,  2)
    .match(/"mac": ".*?"/g)
    .toString()
    .match(/\w\w:\w\w:\w\w:\w\w:\w\w:\w\w/g)
  ;
}


console.log( macs() );//create a server object:
http.createServer(function (req, res) {
  res.write('hello world {'+macs().toString()+' }'); //write a response to the client
  res.end(); //end the response
}).listen(8100); //the server object listens on port 8080

var handleRequest = require("./request-handler.js");
var url = require('url');

var http = require("http");

var port = 3000;

var ip = "127.0.0.1";

var router = {
  '/classes/messages': handleRequest.requestHandler
};

var server = http.createServer( function(request, response){
  console.log("Serving request type " + request.method + " for url " + request.url);

  var route = router[url.parse(request.url).pathname];
  //console.log(route)
  if (route) {
    route(request, response);
  } else {
    handleRequest.sendResponse(response, '', 404);
  }
});

console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);

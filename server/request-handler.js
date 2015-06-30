/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var exports = module.exports = {};
var messages = [];
var objectIdCounter = 1;

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "application/json"
};

exports.sendResponse = function(response, data, statusCode){
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(data));
};

var makeActionHandler = function(actionMap){
  return function(request, response) {
    var action = actionMap[request.method];
    if (action) {
      action(request, response);
    } else {
      exports.sendResponse(response, '', 404);
    }
  }
};

var collectData = function(request, callback){
  var data = "";
  request.on('data', function(chunk){
    data += chunk;
  });
  request.on('end', function(){
    callback(JSON.parse(data));
  });
};

var requestAction = {
  "GET":function(request,response){
    exports.sendResponse(response, {results: messages});
  },
  "POST":function(request,response){
    collectData(request, function(message){
      message.objectId = ++objectIdCounter;
      messages.push(message);
      exports.sendResponse(response, {objectId: message.objectId}, 201);
     });
  },
  "OPTIONS":function(request,response){
    console.log("Sending OPTIONS request.")
    exports.sendResponse(response,null)
  }

}

exports.requestHandler = makeActionHandler(requestAction)



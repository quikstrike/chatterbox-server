var exports = module.exports = {};
var messages = {};
var successResponse = {
    status  : 201,
    success : 'Updated Successfully'
}

exports.requestHandler = function(request, response) {
  var statusCode = 200;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "application/json";
  var requestURL = require('url').parse(request.url).path
  var requestLoc = requestURL.slice(9, requestURL.length-1)

      if (request.method == 'OPTIONS') {
        console.log("Sent OPTIONS")
        response.writeHead(statusCode, headers);
      }
      if(request.method == 'POST'){
        response.writeHead(201, headers);
        request.on('data', function(chunk) {
          console.log('got %d bytes of data', chunk.length);
          console.log("Received body data:");
          console.log(chunk.toString())
          //Check to see if messages contains anything at that location
          if(messages[requestLoc]){
            //check to see if that location contains any messages
            console.log(requestLoc)
            console.log(messages)
            if(messages.requestLoc.results != undefined){
              //If there are messages grab them, push a new message and reassing messages
              var messagesArray = messages[requestLoc][results]
              messagesArray.push(JSON.parse(chunk.toString()))
              messages[requestLoc][results] = messagesArray
            }
          }else{
            //Since there is no room in messages under that name, we will need to create a new room, and then add messages
            var arr = [JSON.parse(chunk.toString())];
            messages[requestLoc] = {results: arr}
          }
          console.log(messages)
          response.writeHead(statusCode, headers);
        });
        request.on('end', function() {
          console.log("POST Message Received")
        });
        response.end(JSON.stringify(successResponse));
      }
      if(request.method == "GET"){
        //console.log(require('url').parse(request.url))
        if(messages[requestLoc]){
          response.write(JSON.stringify(messages[requestLoc]))
          response.writeHead(200, headers);
        }else{
          response.writeHead(404, headers);
        }
        //response.write(JSON.stringify({results:messages}))
      }
  response.end();
};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

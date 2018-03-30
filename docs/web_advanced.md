# Web Advanced

## HTTP Client

The class *HttpClient* is the most used class throughout Diamond, so it's important to know its complete functionality in order to write a proper application in Diamond.

You've already been introduced to some of its functionality, so here we'll focus on the rest of its functionality.

The *HttpClient* is roughly the equivalent to *HttpContext* from ASP.NET.

You might want to look at the API documentation for the *HttpClient* class as well, to see how each property actually functions as this is just an overview over the properties.

### .route

The *.route* property returns the current route of the http client, which can be used to check the route name, action, params etc.

### .method

The *.method* returns the current http method of the request.

### .session

The *.session* property will return the session context of the client.

### .cookies

The *.cookies* property will return the cookie context of the client.

### .cookieConsent

The *.cookieConsent* property will return the consent of the user.

You can also set the cookie-consent of a user through this property.

Should be noticed that cookie-consent is stored as a cookie on the user's computer.

### .ipAddress

The *.ipAddress* property will return the ip address of the client.

### .requestStream

The *.requestStream* property will return the vibe.d input-stream for the request.

### .responseStream

The *.responseStream* property will return the vibe.d output-stream for the response.

### .connected

The *.connected* property will return a boolean that determines whether the response is connected or not.

### .path

The *.path* property will return the current path specified in the url of the request.

### .queryString

The *.queryString* property will return the query string of the url.

~Note: This returns the raw result of the query string. For a mapping use *query*~

### .query

The *.query* property will return the query string of the url as a map.

### .httpParams

The *.httpParams* property will return generic parameters of the request.

These parameters can be form values, query string values etc.

### .files

The *.files* property will return the temporary file paths of files uploaded.

### .form

The *.form* property will return the form data of the request.

### .fullUrl

The *.fullUrl* property will return the full url of the request.

### .json

The *.json* property will return mapped json of the request.

~Note: If you have a model that is equivalent to the json of the request, then you can use the function *getModelFromJson*.~

### .contentType

The *.contentType* property will return the content-type of the request.

### .contentTypeParameters

The *.contentTypeParameters* property will return the content-type-parameters of the request.

### .host

The *.host* property will return the host of the request.

### .headers

The *.headers* property will return the headers of the request.

### .tls

The *.tls* property will return a boolean determining whether it's a tls connection or not.

### .clientAddress

The *.clientAddress* property will return the raw client address of the request.

### .clientCertificate

The *.clientCertificate* property will return the certificate of the request.

### .redirected

The *.redirected* property will return a boolean determining whether the client has been redirected.

### .role

The *.role* property will return the role of the client.

### .statusCode

The *.statusCode* property will return the current status code of the response.

### .language

The *.language* property will return the current language of the user.

It can also be used to set the language of the user.

This requires i18n to be implemented however.

### .getModelFromJson()

The *.getModelFromJson* function can return a model from json.

It's a simple function that you only give the parameters to the type's constructor.

If the type has no constructor with parameters then you can leave out parameters.

Example:

```
auto model = client.getModelFromJson!MyModel;

...

auto model2 = client.getModelFromJson!MyModel2(100, 200);
```

### .addContext()

The *.addContext* function will add context data to the client.

Context data can be used to save data to the current request that you want to use later down in the call-chain.

It's useful to share data from two decoupled areas that only share a *HttpClient*.

### .getContext()

The *.getContext* function will get context data from the client.

You can also specify a default value to the function, which is the data that will be returned if the client doesn't have the context defined.

### .hasContext()

The *.hasContext* function will return a boolean that determines whether the client has a specific context defined or not.

### .redirect()

The *.redirect* function will redirect the client to a given url.

You can also give the redirection a specific status code if needed.

### .error()

The *.error* function will give an error status code to the client.

It will stop execution from where it currently is at and return the response of the client.

### .notFound()

The *.notFound* function is a wrapper around *error()* that will throw a 404.

### .unauthorized()

The *.unauthorized* function is a wrapper around *error()* that will throw a 401.

### .login()

The *.login* function will login the client.

### .logout()

The *.logout* function will logout the client.

### .write()

The *.write* function will write data directly to the response stream.

### .getBody()

The *.getBody* function is only available when logging is enabled, but it will return the current response stream as a buffer.

## Redirections

We've already covered the basics of redirections as they can be done with the *.redirect* function of the *HttpClient* class.

However there are some more concepts to redirection.

Like if you redirect in a controller you don't need to use the *HttpClient* function for it.

A controller has a graceful function called *redirectTo* which will redirect the client and return a property status to return in the controller action.

If you do however use *HttpClient* to redirect from a controller, then use the *.redirected* property to return the property status for the controller action, since it can be used to check whether the client has been redirected.

Generally you don't want to continue execution if a client has been redirected.

Example:

```
Status someCall()
{
    if (!isLoggedIn(client))
    {
        return redirectTo("/login");
    }

    return Status.success;
}
```

## Routing

Diamond has a lot of different routing concepts implemented and we've already looked at most of them.

It's time to look at one of the more complex ways of routing, which is routing on the top layer of the application.

These routes can be used as simple route-rewriting for simple internal usage.

To use specialized routes you just specify them in your *web.json* as they're simply configurations.

The configuration property is called *specializedRoutes*.

### External

An external route will fetch the response from the external url and return that as the response.

```
"specializedRoutes": {
  "routeToRewrite": {
    "type": "external",
    "value": "externalUrl"
  }
}
```

### Internal

An internal route will fetch response from an internal route and return that as response.

```
"specializedRoutes": {
  "routeToRewrite": {
    "type": "internal",
    "value": "internalRouteNotUrl"
  }
}
```

### Local

A local route will fetch response from a locally hosted web application.

```
"specializedRoutes": {
  "routeToRewrite": {
    "type": "local",
    "value": "portToLocalApplication"
  }
}
```

## Websockets

Websockets are becoming an essential part of web development and thus Diamond implements websockets with a user-friendly API.

It requires minimum knowledge of websockets (At least server-side) since you don't have to worry about setting up a websocket server as Diamond does that behind the scene when you want to use websockets.

Basically first you need to implement a websocket service.

You can do that by inheriting the *WebSocketService* class.

```
private final class TestWebSocketService : WebSocketService
{
  final:
  this()
  {
    super("/ws"); // The route to access the websocket at.
  }
}
```

In order to use the websocket service you need to tell Diamond to use the websocket.

You can do that by adding the service with the function *addWebSocketService*.

```
addWebSocketService(new TestWebSocketService);
```

After that you just need to override the functions of the websocket service.

You don't need to worry about how a websocket is implemented as the *WebSocketService* class takes care of that.

You only need to worry about handling the data from the socket.

### Handling a connection

```
override void onConnect(WebSocket socket)
{
  socket.add("id", "mySocket");

  print("'%s' connected ...", socket.get!string("id"));
}
```

### Handling messages

Reading messages are asynchronous actions and thus it's not blocking.

Thanks to how D implements fibers and how vibe.d utilizes it then you can write asynchronous code that looks synchronous like below.

Which makes maintainability so much easier, as displayed below.

```
override void onMessage(WebSocket socket)
{
  print("'%s' received a message ...", socket.get!string("id"));

  auto message = socket.readText();

  string message2;
  if (!socket.readTextNext(message2)) return;

  uint uintValue;
  if (!socket.readNext!uint(uintValue)) return;

  bool boolValue;
  if (!socket.readNext!bool(boolValue)) return;

  print("values: ['%s', '%s', %d, %s]", message, message2, uintValue, boolValue);

  socket.send("Hello World!");
  socket.send(12345);
}
```

### Handling disconnections

```
override void onClose(WebSocket socket)
{
  print("'%s' has closed ...", socket.get!string("id"));
}
```

### Client-side Example

```
var socket = new WebSocket("ws://127.0.0.1/ws");

socket.onopen = function (event) {
  console.info("Open ...");

  for (var i = 0; i < 3; i++) {
    console.info("Begin send ...");
    socket.send("Hello Message1!");
    socket.send("Hello Message2!");
    socket.send(12345);
    socket.send(true);
  }
};

socket.onmessage = function (event) {
  console.info("Received:");
  console.info(event.data);
};

socket.onclose = function(event) {
  console.info("Closed ...");
};
```

# Error Handling

Error handling plays a big part of software development.

Diamond provides easy functionality to handling errors.

The functionality for handling errors exists within the *websettings.d* module usually find in your project's core folder.

The two function you have to handle are *onHttpError* and *onNotFound*.

They give you access to the raw vibe.d requests and responses and not the wrapper Diamond has around them called *HttpClient*.

That is because errors can occur before the establishment of the *HttpClient* or during its establishment.

Additionally *onHttpError* also provides access to *HTTPServerErrorInfo* which gives error information provided by vibe.d

```
override void onHttpError(Throwable thrownError, HTTPServerRequest request,
  HTTPServerResponse response, HTTPServerErrorInfo error)
{
  response.bodyWriter.write(thrownError.toString());
}
```

```
override void onNotFound(HTTPServerRequest request, HTTPServerResponse response)
{
  import std.string : format;

  response.bodyWriter.write(format("The path '%s' wasn't found.", request.path));
}
```

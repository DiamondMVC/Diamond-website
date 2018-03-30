# Logging

Logging is an essential part of software and thus Diamond also applies logging functionality.

There are 3 ways of logging within Diamond.

File logging, Database logging and custom logging.

Each way of logging has 5 logging types.

#### error

Will log any errors the application encounters.

#### notFound

Will log any invalid paths the application encounters.

#### before

Will log any request before their handling.

#### after

Will log any request/response after their handling.

#### staticFile

Will log static file handling.

## File Logging

To log to a file you simply specify the type of the logging and then the file to log.

```
logToFile(LogType.error, "errors.log");
```

You can also give the function a callback that will be called when the logging has taken place.

This can be used to forward the logging result and use it to do some other logging.

This can be used to do custom logging without a custom logging handler.

```
logToFile(LogType.error, "errors.log",
(result)
{
    import diamond.core.io;
    print(result.toString()); // Prints the log out to the console as well ...
});
```

## Database Logging

You can also log to a mysql database.

Using the database logger requires a table with the following columns:

* logToken (VARCHAR)
* logType (ENUM ("error", "notFound", "after", "before", "staticFile"))
* applicationName (VARCHAR)
* authToken (VARCHAR)
* requestIPAddress (VARCHAR)
* requestMethod (VARCHAR)
* requestHeaders (TEXT)
* requestBody (TEXT)
* requestUrl (VARCHAR)
* responseHeaders (TEXT)
* responseBody (TEXT)
* responseStatusCode (INT)
* message (TEXT)
* timestamp (DATETIME)

When you specify your database logger you give it a logging type and then the table to log to.

It will internally use the default mysql connection.

However it's possible to specify a custom connection string if neccessary.

```
logToDatabase(LogType.error, "logs");
```

And just like file logging you can specify a callback for database loggers too.

```
logToDatabase(LogType.error, "logs",
(result)
{
     import diamond.core.io;

     print("Logged '%s' to the database.", result.logToken);
});
```

## Custom Logging

It's possible to specify your own loggers too, which can be used to log to something else other than files or a mysql database.

This could be used to ex. log to a mssql database.

```
log(LogType.error, (result)
{
    logToMSSQLDatabase(result); // Custom implementation to log to a MSSQL database.
});
```

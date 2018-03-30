# Mail

Diamond implements mail functionality, which basically wrap a user-friendly API on top of vibe.d's smtp client implementation.

Before you send a mail you must specify smtp settings for the target smtp server.

This can be done using the class *SmtpClientSettings*.

```
auto settings = SmtpClientSettings("smtphost", 1919); // host, port
```

The class has properties for username, password etc.

For more information see the API.

Then you can pass those settings to the mail.

A good idea is to store the settings somewhere, so you don't have to construct them every time you construct a mail.

```
auto mail = new SmtpMail(settings);

mail.fromMail = "<user@somesmtp.com>";
mail.recipient = "<recipient@somesmtp.com>";
mail.subject = "Test mail";
mail.message = "Hello Diamond!";

mail.send();
```

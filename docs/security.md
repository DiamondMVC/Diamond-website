# Security

Security is important, especially when it comes to handling a data, input and authentication.

Diamond provides a lot of security functionality that you can take advantage of when developing your site.

## ACL

ACL (Access Control List) can be implemented easily in Diamond with a user-friendly API.

It's recommended to setup your roles and permissions in the **onApplicationStart()** function located in your websetting class.

You must import **diamond.authentication** to be able to use the ACL outside of controllers.

To create a role you must use the **addRole()** function.

Example:

```
auto guest = addRole("guest");
auto user = addRole("user");
auto admin = addRole("admin");
```

When you create a role you can also pass another role to it which will serve as a parent role. If permissions aren't set for the user then the parent's permissions are used.

There are no limits on role inheritance.

```
auto administrators = addRole("administrators");

auto owner = addRole("owner", administrators);
auto superUser = addRole("super-user", administrators);
```

The role class has a function called **addPermission()** which is used to add permissions for a role.
The function returns the role class instance, which means it can be chained.

The arguments of the **addPermission()** are as following: **resource**, **readAccess**, **writeAccess**, **updateAccess**, **deleteAccess**.

```
auto guest = addRole("guest")
  .addPermission("/", true, false, false, false) // Guests can view home page
  .addPermission("/user", true, true, false, false) // Guests can view user pages, as well register (POST)
  .addPermission("/login", true, true, false, false) // Guests can view login page, as well login (POST)
  .addPermission("/logout", false, false, false, false); // Guests cannot logout, because they're not logged in

auto user = addRole("user")
  .addPermission("/", true, false, false, false) // Users can view home page
  .addPermission("/user", true, false, true, false) // Users can view user pages, as well update user information (PUT)
  .addPermission("/login", false, false, false, false) // Users cannot view login page or login
  .addPermission("/logout", false, true, false, false); // Users can logout (POST)
```

To use roles you must set a default role by calling the **setDefaultRole()** function.

```
setDefaultRole(guest);
```

## Default Required Permissions

You can change the default permissions for the http methods using **requirePermissionMethod()** and **unrequirePermissionMethod()**

The default permissions are as following:

* HTTP-GET: Requires read-access
* HTTP-POST: Requires write-access
* HTTP-PUT: Requires update-access
* HTTP-DELETE: Requires delete-access

Example: (To create a 100% valid REST API. Since **PUT** should write and update.)

```
requirePermissionMethod(HttpMethod.PUT, PermissionType.writeAccess);
```

## Additional Security

By default permissions not found in the ACL will allow read, write, update and delete.

Sometimes you want to limit the default permissions for unmapped resources.

It can be done by changing the property **defaultPermission** which is a boolean.

```
defaultPermission = false; // Disallow access to resources not mapped with permissions.
```

## Authentication

Authentication is generally done with ACL in Diamond and thus we'll focus on that first.

There is however two types of authentication and the last type can be combined with the ACL authentication.
More about that later in this section.

You must set 3 functions for the ACL to work with authentication.

The functions that must be set are for token validation, token invalidation and token setter.

### Token-validation

The token validation function can be set with the function **setTokenValidator()**

Example: (in **onApplicationStart()**)

```
setTokenValidator(&validateToken);
```

Example: (Function implementation)

The function must return a role which is the role set when the token is valid.

Token validation can differ from implementation, but generally a database look-up can be used.

```
Role validateToken(string token, HttpClient client)
{
  return tokenIsValidInDatabase(token) ? getRole("user") : getRole("guest");
}
```

### Token-invalidation

The token invalidation function can be set with the function **setTokenInvalidator()**

Example: (in **onApplicationStart()**)

```
setTokenInvalidator(&invalidateToken);
```

Example: (Function implementation)

The function must return a role which is the role set when the token is valid.

Token invalidation can differ from implementation, but generally you want to delete it from the database.

```
void invalidateToken(string token, HttpClient client)
{
  deleteTokenFromDatabase(token);
}
```

### Token-setter

The token setter function can be set with the function **setTokenSetter()**

Example: (in **onApplicationStart()**)

```
setTokenSetter(&setToken);
```

Example: (Function implementation)

The function must return a string that is equivalent to the token.

Token setters can differ from implementation, but generally you want to create a unique token and store it in the database.

The token is used to identify the logged in user as well validate that the user is in fact logged in.

```
string setToken(HttpClient client)
{
  auto token = generateAuthToken();
  insertTokenToDatabase(token);

  return token;
}
```

To login you simply call the **login()** function and to logout you call the **logout()** function.

They can be accessed from **HttpClient** or with their raw versions in the **diamond.authentication** package.

Login:

```
long loginTimeInMinutes = 99999;
auto userRole = getRole("user");

client.login(loginTimeinMinutes, userRole);
```

Logout:

```
client.logout();
```

You don't need to worry about cookies, sessions etc. it's all done in the background by Diamond.

When using ACL it's preferred to check if a user is logged in by checking their role.

```
if (client.role.name == "user")
{
    // Logged in as a user ...
}
else
{
    // Not logged in as a user ...
}
```

To extend the authentication you have to implement the **IControllerAuth** interface on a class.

The interface is a part of the **diamond.controllers.authentication** module.

The class that implements the interface must be available from the **controllers** package, so make sure you import the module to it from there (Just like you would with controllers normally.)

```
final class TestAuth : IControllerAuth
{
  public:
  AuthStatus isAuthenticated(HttpClient client)
  {
      ...
  }

  void authenticationFailed(AuthStatus status)
  {
      ...
  }
}
```

### AuthStatus isAuthenticated(HttpClient client);

This function is used to validate the authentication of a request.

**AuthStatus** is a class that is used internally to handle the authentication status returned.

It takes the following parameters in its constructor:

```
this(HttpClient client, bool authenticated, string message = null)
```

If there's no instance of **AuthStatus** returned or if **authenticated** is set to false then **authenticationFailed** will be triggered.

### void authenticationFailed(AuthStatus status);

This function is called when authentication has failed for a request.

Note: The status passed to **authenticationFailed** is the status returned by **isAuthenticated**.

**authenticationFailed** should be used to handle failed authentications.

Example of **IControllerAuth** implementation:

```
final class TestAuth : IControllerAuth
{
  public:
  final:
  AuthStatus isAuthenticated(HttpClient client)
  {
    return new AuthStatus(
        request,
        client.cookies.has("loginCookie"),
        "Not logged in."
    );
  }

  void authenticationFailed(AuthStatus status)
  {
    import std.stdio : writefln;

    writefln("Failed auth: %s", status.message);
  }
}
```

To use authentication for a controller, the controller must have the attribute **@HttpAuthentication** which takes a single value as the name of the class that is to be used for authentication.

The class name given must be the one that implements **IControllerAuth**.

```
@HttpAuthentication(TestAuth.stringof) final class HomeController(TView) : Controller!TView
{
    ...
}
```

Authentication will be enabled for all mapped actions within the controller, including the default action.

However authentication can easily be disabled for specific actions (Including the default action.) using the attribute **@HttpDisableAuth**

```
  /// Can be accessed without authentication
  @HttpDisableAuth @HttpDefault Status home()
  {
    return Status.success;
  }

  /// Must be authenticated to access this
  @HttpAction(HttpGet) Status test()
  {
    return jsonString(q{{ "success": true }});
  }

  /// Can be accessed without authentication
  @HttpDisableAuth @HttpAction(HttpGet) Status test2()
  {
    return jsonString(q{{ "success": true }});
  }
```

## CSRF Protection

CSRF Protection is built-in to Diamond and can easily be integrated with forms, as well as validated in an application’s backend.

Before you set the token you must clear the current token.

You can do that by calling the function **clearCSRFToken**

Example:

```
@:clearCSRFToken();
```

Then within your form you want to append the token field.

```
<form>
@:appendCSRFTokenField("formToken");

@* other fields here *
</form>
```

Then within your controller you can call the function **isValidCSRFToken** which validates the token.

Example:

```
auto bankTransferModel = view.client.getModelFromJson!BankTransferModel;

import diamond.security;

if (!isValidCSRFToken(view.client, bankTransferModel.formToken, true))
{
    view.client.error(HttpStatus.badRequest);
}
```

## Validation

Diamond provides functionality for validating different data such as credit-card numbers, file-data, emails, string-data, urls etc.

### Credit-cards

To validate credit-cards simply call the **isValidCreditCard** function.

It takes two parameters.

The first for the credit-card number and the second for an array of allowed digits.

The second parameter is optional and if it's not specified then the credit-card can have any type of length.

Example:

```
const validCreditCardNumber = "5500000000000004";
const invalidCreditCardNumber = "5500000000000003";

assert(isValidCreditCard(creditCardNumber));
assert(!isValidCreditCard(invalidCreditCardNumber));
```

### Email

To validate emails you simply call the **isValidEmail** function.

It takes 3 parameters.

The first parameter is the email to validate.

The second parameter is a boolean that determines whether the validation should happen through dns.

It's an optional parameter and by default it's set to **false**.

Using dns validation will usually give the best and most correct answer, but it also comes with a performance impact, so for simple email validation it shouldn't be used.

The last parameter a parameter that specifies the error-code level, which is the boundary that an error-code can reach until the email is deemed invalid. It's an optional parameter and you usually don't need to specify it.

Example:

```
const validEmail = "someemail@somesmtp.com";
const invalidEmail = "someinvalidemail.com";

assert(isValidEmail(validEmail));
assert(!isValidEmail(invalidEmail));
```

### Files

File validation is a very important thing when it comes to web application.

Especially if you have file uploads etc. then you want to make sure that the files uploaded matches their extensions.

If you don't validate the data of files uploaded, then someone could potentially upload malicious files.

By default Diamond supports file validation for **jpg/jpeg**, **gif**, **png** and **pdf**.

However it's possible to implement your own file validations that Diamond will use internally to validate with.

To validate files you simply call the function **isValidFile**, which will validate a buffer as the file data, against the given file extension.

Example:

```
auto validImage = cast(ubyte[])read("image.png");
auto invalidImage = cast(ubyte[])read("test.txt");

assert(isValidFile(".png", validImage));
assert(!isValidFile(".png", invalidImage));
```

To specify a custom file validator you simply call the function **addCustomFileValidator**.

It takes two parameters.

The first parameter is the extension to validate and the second parameter is a delegate for handling the validation.

The delegate takes a buffer (ubyte[]) as parameter and returns a boolean which indicates whether the buffer is valida data for the given extension.

Example:

```
addCustomFileValidator(".docx", (buffer)
{
  // validate whether the buffer is a .docx file or not.

  return true;
});
```

### Types

Type validation is important to make sure ex. a given input matches the type you expect.

Diamond currently have support for two type checking, which is whether a given string input is a number or boolean or whether a given integer is a boolean.

Example:

```
const numberString = "12345";
const notNumberString = "Hello World!";

assert(isValidnumber(numberString));
assert(!isValidnumber(notNumberString));
```

### URL

Sometimes it's important to validate a url, if an input can be a url that is used to ex. fetch external resources.

In such case you want to make sure the url is valid, otherwise you could potentially have an unnecessary performance impact trying to access an external resource that is invalid.

Example:

```
const validUrl = "www.diamondmvc.org";
const invalidUrl = "wwwdiamondmvcorg";

assert(isValidUrl(validUrl));
assert(!isValidUrl(invalidUrl));
```

## Network

Sometimes you want restrict certain areas of your application specific IPs.

Diamond implements an easy way to do so.

Basically you just add a list of ips to your **web.json** file and then in your controller you can restrict certain actions to the restricted ips.

If you want to restrict access to a view, simply give the view a controller and then restrict the default action within the controller.

The **web.json** entry looks like this:

```
"restrictedIPs": []
```

The value is an array of ips ex. **["127.0.0.1"]** will block all connections that aren't from **127.0.0.1**.

Sometimes you may also want to globally restrict IPs.

This allows you to restrict the whole application to a set of IPs.

Just like **restrictedIPs** you just define them in your **web.json** file using the configuration called **globalRestrictedIPs**.

However when using global restricted IPs, Diamond will figure out itself how to restrict the application to them.

You don't need to do anything other than specifying the restricted IPs.

## Backups

Backups are an essential part of an application. Without doing backups you risk losing all your work.

Diamond has built-in support for performing backups.

By default there is only support for doing backups of files, but Diamond allows you to implement your own backup services that can backup anything you need to, which can be used to ex. backup sql databases etc.

To start a backup service you simply add your service by calling the function **addBackupService**.

Example:

```
// Does a file backup every 24 hours.
auto fileBackup = new FileBackupService(60000 * 24);

// Will backup files from serverdrive/importantfiles to backupdrive/importantfiles
fileBackup.addPath(BackupPath("serverdrive/importantfiles", "backupdrive/importantfiles"));

addBackupService(fileBackup);
```

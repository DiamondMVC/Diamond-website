# Data

Diamond implements a lot of different ways to handle different data.

Such data could be cookies, sessions, contexts, database related etc.

Diamond provides user-friendly functionality using a high-level API.

## Cookies

Cookies are an essential part of a web application. It's necessary to use cookies if you need to store some kind of information on a user's computer that you may have to use later, but not necessarily during the same session.

A good example of this would be authentication cookies.

You usually want a user to be logged in past their session, since sessions usually last far shorter than the period a user should be logged in.

Diamond provides an easy to use cookie API that can be accessed from the **HttpClient** class, which is available as a property called **client** within controllers and views.

Diamond provides two types of cookies that you can use.

Regular cookies and buffered cookies.

A buffered cookie differs from a regular cookie in that it stores buffered data which can be any type of data.

All cookies within Diamond must be specified with a cookie type, as that type is used to comply with cookie consent, which Diamond implements to easily integrate with the EU cookie law.

The type is also useful for debugging, as you can exclude certain types of cookies to check different behavior on your site.

The following types are available for cookies:

#### general

A general cookie used for miscellaneous functionality.

These cookies have no specific behavior attached to them.

#### functional

A cookie required for minimum functionality of the site.

Such cookies are usually authentication cookies.

#### thirdParty

A third-party cookie is a cookie that is associated with a third-party.

These cookies are usually not set through Diamond, but in certain cases they might be and in that case this option is available.

#### session

Session cookies are cookies associated with the session.

These are cookies that cannot be disabled with the cookie consent.

This cookie type should generally not be used by anything other than Diamond's core.

### Regular Cookies

Regular cookies are plain-old cookies that are presented exactly like how they are in the browser.

To add a regular cookie you must call **create()** which creates a regular cookie.
To get a regular cookie you must call **get()** which will get a regular cookie.
To check if a regular cookie exists you must call **has()** which will check for existence of a cookie in the current request.
To remove a regular cookie you must call **remove()** which will remove a regular cookie.

Example:

```
client.cookies.create(HttpCookieType.general, "myCookie", "Hello World!", 60); // The cookie is alive in the browser for 60 seconds

...

string myCookie = client.cookies.get("myCookie"); // Gets the cookie "myCookie"

...

if (client.cookies.has("myCookie"))
{
    // Do stuff when "myCookie" is present.
}
```

### Buffered Cookies

Buffered cookies are cookies stored as byte buffers.

The buffers are encoded with **SENC** (Simple Encoding) which is a simple encoding algorithm implemented in Diamond.

To add a buffered cookie you must call **createBuffered()** which creates a buffered cookie.
To get a buffered cookie you must call **getBuffered()** which will get a buffered cookie.
To check if a buffered cookie exists you must call **has()** which will check for existence of a cookie in the current request.
To remove a buffered cookie you must call **remove()** which will remove a buffered cookie.

Example:

```
ubyte[] myBufferedCookie = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

client.cookies.createBuffered(HttpCookieType.general, "myBufferedCookie", buffer, 60); // The cookie is alive in the browser for 60 seconds

...

ubyte[] myBufferedCookie = client.cookies.getBuffered("myBufferedCookie"); // Gets the cookie "myCookie"

...

if (client.cookies.has("myBufferedCookie"))
{
    // Do stuff when "myBufferedCookie" is present.
}
```

### The Auth Cookie

The last type of cookie in Diamond is the auth cookie.

The auth cookie cannot be modified directly as it's an internal cookie used by the authentication in Diamond.

To get the auth cookie you must call **getAuthCookie()** which will get the auth cookie.
To check if the auth cookie exists you must call **hasAuthCookie()** which will check for existence of the auth cookie in the current request.

The auth cookie is always the given token for the authentication.

Example:
```
string authToken = client.cookies.getAuthCookie();

...

if (client.cookies.hasAuthCookie())
{
    // Do stuff when the auth cookie is present.
}
```

## Sessions

A session may be shared between multiple requests in the same browser.

Sessions can be used to store temporary data on the server-side that may be used by the same user over multiple requests.

sessions can easily be managed through the **HttpClient**'s **session** properties.

Views and controllers have access to the current client by either the **view.client** or **client** property.

Session values can be of any data-type ranging from strings to classes.

To set a value in the session you must call **setValue()**.
To get a value in the session you must call **getValue()**.
To check if a value is present in the session you must call **hasValue()**.
To remove a value from the session you must call **removeValue()**.
To clear all values you must call **clearValues()**

Example:

```
client.session.setValue("mySessionValue", "Hello World!");

...

string mySessionValue = client.session.getValue("mySessionValue");

...

string mySessionValue = client.session.getValue("mySessionValue", "A default value when mySessionValue isn't present.");

...

if (client.session.hasValue("mySessionValue"))
{
    // Do stuff when "mySessionValue" is present in the session.
}

...

client.session.removeValue("mySessionValue");

...

client.session.clearValues();
```

## Database

Diamond has support for *MySql* databases, but also *NoSql* databases such as *Mongo* and *Redis*.

However *Redis* databases doesn't currently have direct wrappers in Diamond yet, so they have to be used through vibe.d's API.

Diamond implements *MySql* using the library **mysql-native**, but builds on top of it with an ORM (Object Relational Mapping.)

The ORM implemented in *MySql* is generated at compile-time and thus has very little over-head during run-time, which makes it fit for high-performance environment, since it can handle a lot of data.

All models used by the ORM must be placed in the models package.

To use *MySql* within Diamond you must edit your **web.json** file to contain the database configuration.

Example:

```
"dbConnections": {
  "mysql": {
    "default": {
      "host": "127.0.0.1",
      "user": "mysqluser",
      "password": "mysqlpassword",
      "database": "mysqldatabase"
    }
  }
}
```

### Attributes

There are different attributes that you can apply to members of models.

#### @DbNull

All fields that can have a null-value should be marked with this attribute.

#### @DbEnum

All fields that are treated like db-enums should be marked with this attribute.

A db-enum is an enum of strings.

#### @DbTimestamp

All fields of **std.datetime.DateTime** that should be updated with current time on insert/updates should be marked with this attribute.

#### @DbNoMap

All fields that shouldn't be mapped should be marked with this attribute.

#### @DbId

Used to mark which field is used for the identity column.

### Example Model

```
module models.mymodel;

import diamond.database;

class MyModel : MySql.MySqlModel!"mymodel_table"
{
  public:
  @DbId ulong id;
  string name;

  this() { super(); }
}
```

### Example Usages

#### Read Single

```
import diamond.database;
import models;

static const sql = "SELECT * FROM `@table` WHERE `id` = @id";

auto params = getParams();
params["id"] = cast(ulong)1;

auto model = MySql.readSingle!MyModel(sql, params);
```

#### Read Many

```
import diamond.database;
import models;

static const sql = "SELECT * FROM `@table`";

auto modelsRead = MySql.readMany!MyModel(sql, null);
```

#### Insert

```
import models;

auto model = new MyModel;
model.name = "Bob";

model.insertModel();
```

#### Insert Many

```
import models;
import diamond.database;

auto model1 = new MyModel;
model1.name = "Bob";

auto model2 = new MyModel;
model2.name = "Sally";

auto modelsToInsert = [model1, model2];

modelsToInsert.insertMany();
```

#### Update

```
import models;

auto model = new MyModel;
model.id = 1;
model.name = "ThisIsNotBobAnymore";

model.updateModel();
```

#### UpdateMany

```
import models;
import diamond.database;

auto model1 = new MyModel;
model1.id = 1;
model1.name = "ThisIsNotBobAnymore";

auto model2 = new MyModel;
model2.id = 2;
model2.name = "ThisIsNotSallyAnymore";

auto modelsToUpdate = [model1, model2];

modelsToUpdate.updateMany();
```

#### Delete

```
import models;

auto model = new MyModel;
model.id = 1;

model.deleteModel();
```

#### Delete Many

```
import models;
import diamond.database;

auto model1 = new MyModel;
model1.id = 1;

auto model2 = new MyModel;
model2.id = 2;

auto modelsToDelete = [model1, model2];

modelsToDelete.deleteMany();
```

### Parameters

Diamond's MySql implementation allows for two types of parametized queries.

The first one is the traditional parametized statement using **?** and the second one is one using named parameters like **@name**.

#### Traditional

To use traditional parameters you must use the **raw** functions provided by the MySql API such as:

* executeRaw()
* existsRaw()
* readManyRaw()
* readSingleRaw()
* scalarInsertRaw()
* scalarRaw()

Example:

```
import models;
import diamond.database;

static const sql = "SELECT * FROM `mymodel_table` WHERE id = ?";

auto params = getParams(1);
params[0] = cast(ulong)1;

auto model = MySql.readSingleRaw!MyModel(sql, params);
```

#### Named Parameters

To use named parameters you must use the **non-raw** functions provided by the MySql API such as:

* execute()
* exists()
* readMany()
* readSingle()
* scalarInsert()
* scalar()

When using the named parameter **@table** then it will automatically take the table name from the model. You don't need to add **@table** to the named-parameters collection.

Example:

```
import models;
import diamond.database;

static const sql = "SELECT * FROM `@table` WHERE id = @id";

auto params = getParams();
params["id"] = cast(ulong)1;

auto model = MySql.readSingle!MyModel(sql, params);
```

## Mongodb

Diamond has support for Mongodb with a simple wrapper around vibe.d's mongodb implementation.

You call functions such as **insertSingle**, **insertMany**, **findSingle**, **findMany**, **update** and **remove** to handle mongo.

Just like Mysql you setup your configurations in the web.json file ex:

web.json:

```
"mongoDb": {
  "host": "127.0.0.1",
  "port": "27017"
}
```

Example:

```
import diamond.database;

struct Foo
{
  string bar;
  string baz;
}

MongoDb.insertSingle("collectionname.foos", Foo("bar", "baz"));
```

## Transactions

### Snapshot-types

Snapshot types can keep track of a type's value history.

They're only usable with value-types, because they can't do nested tracking.

Example:
```
import diamond.data;

auto value = new Snapshot!int;

value = 100;
value = 200;
value = 300;
value = 400;

import std.stdio : writefln;
writefln("%d %d %d %d %d", value[0], value[1], value[2], value[3], value);

// Prints: 100 200 300 400 400
```

### Snapshot Transactions

Transactions are essential to secure data transactions where invalid/incomplete data cannot be afforded when a commit fails.

A transaction is based on a snapshot-type which can be passed to it, in which the transaction will handle the commit.

#### Example

Let's say we have this:

```
struct BankTransfer
{
	string from;
	string to;
	double money;
}

struct BankAccount
{
  string name;
  double money;
}
```

Without transactions, committing something like a transfer of **$100** from **Bob** to **Sally** is not fail-proof ex. if the commit to the database fails then the transfer never happens, but we might already have updated the bank account of **Bob** to reflect he transferred **$100** and thus he lost **$100** and **Sally** never got the **$100**.

With transactions doing a simple roll-back on both **Bob**'s and **Sally**'s bank account will fix the issue. Attempting to commit the transaction again may done, but isn't necessary as it could have happen due to some critical failure, in which you just want to make sure the commit didn't create any side-effects and in such situation, doing a roll-back only is preferred.

#### Transaction Example

```
auto bob = new Snapshot!BankAccount(BankAccount("Bob", 200));
auto sally = new Snapshot!BankAccount(BankAccount("Sally", 0));

auto transaction = new Transaction!BankTransfer;
transaction.commit = (transfer)
{
    bob = BankAccount(bob.name, bob.money - transfer.money);
    sally = BankAccount(sally.name, sally.money + transfer.money);

    UpdateBankAccount(bob);
    UpdateBankAccount(sally);
};
transaction.success = (transfer)
{
    import diamond.core.io;

    print("Successfully transferred $%d from %s to %s", transfer.money, transfer.from, transfer.to);
    print("Bob's money: %d", bob.money);
    print("Sally's money: %d", sally.money);
};
transaction.failure = (transfer, error, retries)
{
    bob.prev(); // Goes back to the previous state of Bob's bank account
    sally.prev(); // Goes back to the previous state of Sally's bank account

    return false; // We don't want to retry ...
};

auto transfer = new Snapshot!BankTransfer(BankTransfer("Bob", "Sally", 100));
transaction(transfer);
```

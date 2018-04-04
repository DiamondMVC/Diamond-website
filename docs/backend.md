# Backend

Working with the backend of a web application is necessary to split design (UI) and logic away from each other.

It's usually done through controllers, which is the recommended way in Diamond.

Diamond follows the principles from MVC (Model-View-Controller) and thus the pattern is as following.

A request will first access the controller of a view, the controller can then generate the model, handle data, perform business logic etc. and at last give the data to the view (The data could be in form of a model etc.)

## Web-api

A web-api is a form for web-server application that doesn't provide a frontend (Views) and only provides a backend (Controllers)

To use a web-api you must modify the **dub.json** file to use the version **Diamond_WebApi** instead of **Diamond_WebServer** which tells Diamond to build the application as a web-api and not a website.

Once that is done all you have to do is just create the controllers you want to associate with the web-api.

Generally controllers for a web-api are the same as they are for a website, but there are some minor differences.

By default the route to access a controller within the web-api is the name of the controller (Without the **Controller** part.)

Ex. **HomeController** can be accessed like **/home**

However if you wish to use a different route for the controller then you can use the attribute **HttpRoutes** which allows you to specify custom routes for a controller.

Example:

```
// You can access the controller with /my
@HttpRoutes("my") final class MyController(TView) : Controller!TView
{
    ...
}
```

```
// You can access the controller with /my or /yours or /thirdRoute
@HttpRoutes(["my", "yours", "thirdRoute"]) final class MyController(TView) : Controller!TView
{
    ...
}
```

## REST

Implementing REST in Diamond is very easy. By default everything is very REST-like, but there a few touches left to truly create a RESTful application in Diamond.

First you need to use ACL in order to make sure resources are used in the right way.

You'll learn more about ACL later, so don't worry about that part here.

That part is explain <a href="/docs/security/#default-required-permissions">here</a>.

Once ACL has been done correctly then using RESTful routes for controller actions is the recommended way in Diamond.

That can be achieved using special routes for the controller actions.

If the first entry is **&lt;&gt;** then it will use the function name as the action name, otherwise the first entry specified is the action name.

To create an entry with a specific type you must write **{type}** and to get the entry a specific name you must write **{type:name}**.

The route also supports wildcards which will accept anything. Wildcards are specified with \*

### Example routes:

```
@HttpAction(HttpGet, "/product/{uint:productId}/") Status getProduct()
{
    auto productId = get!uint("productId");
    auto product = getProductFromDatabase(productId);

    return json(product);
}
```

```
@HttpAction(HttpPut, "/product/{uint:productId}/") Status insertOrUpdateProduct()
{
    auto productId = get!uint("productId"); // If the id is 0 then we'll insert, else we'll update.

    insertProductToDatabase(productId, view.client.json); // Normally you'll want to deserialize the json

    return jsonString(`{ "success": true }`);
}
```

```
@HttpAction(HttpDelete, "/product/{uint:productId}/") Status deleteProduct()
{
    auto productId = get!uint("productId");

    deleteProductFromDatabase(productId);

    return jsonString(`{ "success": true }`);
}
```

There are two functions provided by the controller used to retrieve the passed data.

### get(T)(string name);

Will get named values. Ex. in the examples above **productId** would be a named value.

### get(T)(size_t index);

Will get values based on their index in the route. Ex. **productId** would have be at index **0**.

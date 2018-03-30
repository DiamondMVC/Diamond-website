# Controllers

The examples focuses mostly on controllers for websites, however using them for web-apis are pretty much the same, except for no view support.

## Setting up a controller

Controllers are simply classes that inherit from the *Controller* class. To create a controller, one must create a new class that inherits from that. For websites you must specify a generic type for views.

```
final class MyController(TView) : Controller!TView
{
}
```

The entry route for a controller is always the view that it inherits.

For web-apis it's of course the name given to the controller.

This means that controllers for websites are more dynamically, as they aren't defined by themselves, but by views, where as controllers for web-apis are always stand-alone.

### The constructor

After declaring a controller, a constructor must be setup.

The constructor for websites takes in a view, where the constructor for a web-api takes a request, response and a route.

The constructor is called for every request and can be used to handle connections before actions.

## Mapping

There are 3 types of actions that can be mapped to routes.

Default actions, mandatory actions and regular actions.

A controller can only have one default action, which is the action called when no action has been specified, a mandatory action is an action that is always called and must go through successfully for the actual action to be executed.

Mandatory actions can be used for authentication, validation etc. and can only be mapped once just like default actions. At last there is the regular actions, which are just actions mapped to a specific action route.

Routing for controllers are as following:

```
/{controller-route|view-route}/{action}/{params}
```

Note: Instead of using params, you can use query strings.

* void mapDefault(Action fun);
* void mapDefault(Status delegate() d);
* void mapDefault(Status function() f);

*mapDefault* maps the default action.

* void mapMandatory(Action fun);
* void mapMandatory(Status delegate() d);
* void mapMandatory(Status function() f);

*mapMandatory* maps a mandatory action.

* void mapAction(HttpMethod method, string action, Action fun);
* void mapAction(HttpMethod method, string action, Status delegate() d);
* void mapAction(HttpMethod method, string action, Status function() f);

*mapAction*  will map an action to a method and an action name.

These functions are usually called in the constructor, however it's recommended to just use the attributes available for mapping. The examples below rely on the mapping attributes.

Example implementation on a constructor

```
this(TView view)
{
    super(view);
}
```

## Actions

In this case *defaultAction* will be used to tell the user he needs to specify an action, *getData* will get some json data and *saveData* will save some json data.

### defaultAction

```
@HttpDefault Status defaultAction()
{
    view.model.message = "You must specify an action.";

    return Status.success;
}
```

### getData

```
@HttpAction(HttpGet) Status getData()
{
    auto id = this.getByIndex!int(0); // The first parameter is the id

    auto data = Database.getData(id); // Gets data from the id

    return json(data); // Returns the data as a json response
}
```

*getData* can be called like */MyView/GetData/10000* where ~MyView~ is the view we call the action from, ~GetData~ is the route to the mapped action and ~10000~ is the first parameter specified.

### saveData

```
@HttpAction(HttpPost) Status saveData()
{
    auto id = this.getByIndex!int(0); // The first parameter is the id

    Database.saveData(id, view.client.json); // Saves the json data to the specified id.

    // Returns a json response with a boolean set as true for success
    return jsonString(`{
        "success": true
    }`);
}
```

*saveData* can be called like */MyView/SaveData/10000* where ~MyView~ is the view we call the action from, ~SaveData~ is the route to the mapped action and ~10000~ is the first parameter specified. The body of the request should be json data to save.

For web-apis you don't need to specify view to retrieve params, request, response etc.

## View-integration

To integrate a controller with a view all you have to do is specify the name of the controller's type within the view's metadata section.

Example:

```
@[
  controller:
    MyController
]
```

You don't have to worry about calling the controller or anything else.

Diamond will automatically take care of that and optimize the calling in the best way.

## Version-control

Diamond supports version control for controllers, which is useful when developing for production.

This allows you to add new functionality without breaking existing functionality.

To use version-control you must assign a controller with the *@HttpVersion* attribute which takes two values.

The values of the attribute are as following.

### Version Identifier

The first value of the attribute is the version identifier. This is the version in which the controller must branch out to the new controller.

Ex. if the identifier is *v2* then the controller will branch out when a request is sent with *v2* as the version.

~Note: You cannot have multiple versions to branch to. A controller may only branch out once.~

### Version Controller

The second value of the attribute is the name of the controller which the current controller branches out to.

The value must be in form of a string, since you can't pass symbols to an attribute.

#### Example Of Version-control

Old home controller:

```
@HttpVersion("v2", NewHomeController.stringof) final class OldHomeController(TView) : Controller!TView
{
  public:
  final:
  /**
  * Creates a new instance of the old home controller.
  * Params:
  *   view =  The view assocaited with the controller.
  */
  this(TView view)
  {
    super(view);
  }

  /// Route: / | /home
  @HttpDefault Status home()
  {
    return Status.success;
  }

  /// Route: /home/getValue
  @HttpAction(HttpGet) Status getValue()
  {
      return jsonString(`{
          "success": true,
          "message": "Old"
      }`);
  }
}
```

New home controller:

```
final class NewHomeController(TView) : Controller!TView
{
  public:
  final:
  /**
  * Creates a new instance of the new controller.
  * Params:
  *   view =  The view assocaited with the controller.
  */
  this(TView view)
  {
    super(view);
  }

  /// Route: /home/v2
  @HttpDefault Status home()
  {
    return Status.success;
  }

  /// Route: /home/v2/getValue
  @HttpAction(HttpGet) Status getValue()
  {
      return jsonString(`{
          "success": true,
          "message": "New"
      }`);
  }
}
```

When calling: */home/getValue* you get the following json:

```
{
    "success". true,
    "message". "Old"
}
```

When calling: */home/v2/getValue* you get the following json:

```
{
    "success". true,
    "message". "New"
}
```

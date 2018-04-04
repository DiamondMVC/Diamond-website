# Views

## Syntax

### Code Block

```
@{
  // Any piece of D code will fit here.
  // You can declare functions, classes, variables etc.
}
```

Example:

```
@{
  auto getFoo()
  {
    return "bar";
  }
}
```

### Escaping Text

```
@(Text or symbols to escape, this can even be D code or Diamond expressions)
```

Example:

```
@(<span>The tags are escaped</span>)
```

### Escaping Variables/Expressions

```
@$=variable_to_escape;
@$=(expression_to_escape);
```

Example:

```
@:auto foo = "<span>Bar</span>";

@$=foo;
```

### Unescaping Variables/Expressions

```
@=var_to_not_escape;
@=(expression_to_not_escape);
```

Example:

```
@:auto foo = "<span>Bar</span>";

@=foo;
```

### Linear Expressions

```
@:linear_code

@:linear_code {

}

@* Linear code will work with nested {}, [] or () *
```

Example:

```
@:foreach (person; persons) {
  <span>Person: @=person.name;</span>
}

@:if (foo) {
  <span>@=foo;</span>
}
@:else {
  <span>@=bar;</span>
}
```

### Comments

```
@* Comment here *

@*
  Comment here
*
```

Example:

```
@*
  Hello World!
*
```

### Metadata Block

```
@[
  // Metadata here
]
```

Example:

```
@[
  layout:
    layout
---
  route:
    home
]
```

### Placeholders

```
@<placeholder>

@<%i18n_placeholder%>
```

Example:

```
@<title>

@<%message%> @* Translates to: @=i18n.getMessage(client, "message")); *
```

### Sections

```
@!sectionName:

@* Creates a default section*
@!:
```

Example:

```
@!phone:
<div class="phone">
  <p>Hello Phone!</p>
</div>

@!desktop:
<div class="desktop">
  <p>Hello Desktop!</p>
</div>
```

```
@:render("view1", "phone"); // Will render view1 with the phone section
@:render("view1", "desktop"); // Will render view1 with the desktop section
```

## Layouts

Layouts are important for dynamic web pages, because it lets you share a design between multiple pages without having to manually write the design html for each page.

If you're coming from ASP.NET, a layout page would be the equivalent to a master page.

A layout must implement a placeholder called **@&lt;view&gt;** which is where the view will be rendered within the layout page.

Example:

```
@<doctype>
<html>
<head>
  <title>@<title></title>
</head>
<body>
  @<view>
</body>
</html>
```

To use a layout your view must specify the layout to use within its metadata block.

```
@[
  layout:
    layout
---
  route:
    home
---
  placeholders: [
    "title": "Home"
  ]
]

<p>Hello Diamond!</p>

```

The output page will look like this:

```
<!DOCTYPE html>
<html>
<head>
  <title>Home</title>
</head>
<body>

  <p>Hello Diamond!</p>

</body>
</html>
```

## Models

You've already learned the basics about models <a href="/docs/models">here</a>.

Now it's time to learn how to use them with a view.

We'll not take a look at how to define a model as that was covered previously, but we'll look at how to use the model.

Basically a view comes with a property called **model** which gives you access to the model directly.

You don't need to cast or anything as Diamond has already taken care of given you the right model type.

All you have to do is just access the properties of the model and use them however you want.

If you we use the example given previously which looked like this:

```
final class Foo
{
  immutable(int) bar;
  immutable(uint) baz;

  public:
  this(int bar, uint baz)
  {
    this.bar = bar;
    this.baz = baz;
  }
}
```

Then it's possible to access the members of **Foo** called **bar** and **baz** by just doing:

```
model.bar
model.baz
```

Example:

```
<span>Bar: @=model.bar;</span><br>
<span>Baz: @=model.baz;</span>
```

## Partial Views

A partial view is a view without a route.

Partial views may still use layouts however.

Partial views are useful to share specific components between views.

To render a partial view you just have to call either of the following functions:

* render()
* renderModel()

One thing should be noticed. **render()** can render views based on the name being specified at run-time.
However **renderModel()** must have the name available at compile-time, that is due to retrieving the correct model type at compile-time for maximum efficiency.

```
@:render("nameOfPartialView");

@:render!"nameOfPartialViewWithModel"(new Model(100, 200));
```

## Sections

Sections are useful to create specific sections of a view that can be rendered dynamically without rendering the whole page.

This is especially useful in certain responsive designs, which allows you to have one view for all devices, but when rendering you select which device to render.

Under syntax there is an example on how to define sections.

So we'll just look at how to render them.

Basically it's the same as rendering partial views, but you put on an extra parameter for the section you want to render.

Example:

```
@:render("nameOfPartialView", "desktop");

@:render("nameOfPartialView", "phone");
```

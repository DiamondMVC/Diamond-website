# Models

Models are necessary for a good dynamic website design, especially when it comes to partial views with dynamic data.

In Diamond there are no limits on the type of a model and it can be anything from integers to complex classes.

There are no implementation details on models either, as it's completely up to you how you want the model to work.

We do not have any guide-lines on how you should use or implement models.

However to use models for views you must specify them in the view's metadata.

There is going to be more information on the metadata when you learn about views.

The model section in a view's metadata is called **model**

Example:

```
@[
  model:
    Type
]
```

The above is an example on how a model is specified in a view's metadata.

You can replace **Type** with the type your model is.

Ex:

```
model:
  int
```

The above will have a view with the model as a 32 bit signed integer.

However there is no extra complexity in order to use a class as model.

```
model:
  Foo
```

The above could ex. be a class named Foo defined as below.

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

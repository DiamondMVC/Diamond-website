# Frontend

Diamond provides certain functionality that is useful for generating dynamic frontend content without being in the view

The functionality can of course be used within the view too as shown in the examples here.

However it's common to use this functionality within controllers to render content from there.

## Virtual HTML Elements

Diamond allows different types of HTML elements, all available under the module **diamond.web.elements**

The elements span from elements such as **div**, **p**, **a** to form elements like **form**, **select**, **input** etc.

You can read more about the elements and their specific properties within the API docs.

Example:

```
@{
  auto paragraph = new Paragraph;
  paragraph.inner = "Hello World!";
}

@=paragraph.toString();
```

The above will render:

```
<p>Hello World!</p>
```

# Files

File handling plays a major part of websites.

There are different file-handling concepts that a website utilize such as static files (Media, style-sheets, scripts etc.) and then there are internal file-handling concepts such as handling file uploads and remote downloading of file resources.

Diamond implements easy-to-use functionality for all of them.

## Static Files

Static files are the most commonly used file concept when it comes to web pages.

They play a big role of page rendering, whether you've noticed it or not, but you use them every day you work with a webpage.

A static file is basically a file that a webpage serves directly such as an image, a javascript file or a stylesheet.

In Diamond you can specify multiple paths that static files are retrieved from.

Diamond doesn't allow all paths to just be used by default for security reasons, unlike other web-frameworks you have to specify directly which paths should be allowed to serve files directly.

This is a design decision by Diamond to make sure security is properly, the last thing you want is someone gaining access to files they shouldn't.

Within your **web.json** file you have a section called **staticFileRoutes** in which you can specify which routes (paths) serves static files.

By default it's usually **public**.

Note: The path itself can be excluded ex. if the systme file-path is **/public/css/mycss.css** then the linking should be: **www.mydomain.com/css/mycss.css**

There are no special rules on which types of files you can serve, basically any type of file can be served.

How the files are handled is up to the specific browsers, but generally images, stylesheets, javascript files etc. are all handled the same across major browsers.

## Upload

Handling uploads in Diamond is very easy. You can do it directly by using the property called **files** which **HttpClient** implements or you can use the user-friendly function specified in **diamond.web.file.upload** called **uploaded()**

It's recommended to use the **uploaded()** function since it already does what you'd usually do with the **files** property.

The function takes takes a parameter as the client to handle files for and then a delegate which is the files to handle.

The delegate takes two parameters of the path to the temporary file provided by the **files** property and the name of the file.

Example:

```
client.uploaded((fileTempPath, fileName) {
  move(fileTempPath, "files/" ~ fileName);
});
```

## Download

Sometimes you want to download external resources or files to use within your web application.

Diamond provides functionality for fetching data or files from remote paths.

Using the functions within **diamond.web.file.download** you can easily manage file downloads.

Example:

```
// Downloads somefile.zip from www.someexternaldomain.com and places it within the file system at somelocal/path/somefile.zip
download("www.someexternaldomain.com/somefile.zip", "somelocal/path/somefile.zip");
```

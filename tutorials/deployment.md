# Deployment

Once your application is finished and ready for production, then deploying it the correct way is important.

* Deploying with <a href="#deploying-with-nginx">Nginx</a>
* Deploying with <a href="#deploying-with-heroku">Heroku</a>
* Deploying with <a href="#deploying-with-microsoft-azure">Microsoft Azure</a>

## Deploying with Nginx

<a href="http://nginx.org/">
  <img src="http://nginx.org/nginx.png" alt="Nginx" style="width: 33%; max-height: 258px;">
</a>

First download and install Nginx which can be found <a href="http://nginx.org/">here</a>.

Nginx works with Windows, Linux &amp; macOS.

We suggest to use Nginx with a Linux server, but running it on a Windows server works fine.

After it has been installed go into its installation folder, then into the folder named **conf** and open the file called **nginx.conf**

Now find the **http { }** section and add the following entry:

```
server_names_hash_bucket_size 64;
```

So it looks something like:

```
http {
  ...

  server_names_hash_bucket_size 64;

  ...
}
```

Otherwise you may experience trouble when you try to set up a reverse proxy.

After that is done go into the folder within the **conf** called **sites-enabled**.

If the folder doesn't exist then create it.

The **sites-enabled** folder is the folder that contains configurations for all sites you have deployed.

Basically you just place custom **.conf** files within that folder.

It's recommended that the name of the file is the domain of the deployed site.

Ex. **diamondmvc.org** would be **diamondmvc_org.conf**

Now create a config file for your deployed site.

The base content should look like this:

```
server {
	listen    80;
	server_name DOMAIN;

	location / {
		proxy_pass LOCALHOST;
		proxy_redirect off;
		proxy_http_version 1.1;

		proxy_set_header X-Forwarded-Host $host;
		proxy_set_header Host $host;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Real-IP $remote_addr;
	}
}
```

Simply change **DOMAIN** to the domain of your site and change **LOCALHOST** to the local url of your application.

Example:

```
server {
	listen    80;
	server_name mydomain.com www.mydomain.com;

	location / {
		proxy_pass http://localhost:7676;
		proxy_redirect off;
		proxy_http_version 1.1;

		proxy_set_header X-Forwarded-Host $host;
		proxy_set_header Host $host;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Real-IP $remote_addr;
	}
}
```

The above will forward requests on "mydomain.com" and "www.mydomain.com" to "http://localhost:7676".

Generally you shouldn't open the Diamond application up directly on port 80.

After Nginx has been setup, then it's time to deploy your application.

For more information about Nginx see their documentation <a href="http://nginx.org/en/docs/">here</a>, as there are many ways to further configure it, especially with additional security etc.

To deploy your application, simply build it locally and then create a folder on your server that you can store your application.

Within that folder you just deploy the executable to run, all folders with static files and then your config folder, but it's only necessary to deploy the **web.json** file from your config folder.

Files such as **views.config** are not necessary to distribute with the compiled application.

On top of that you may also need to deploy libraries that are compiled with your executable.

For Windows that would be **libeay32.dll** and **ssleay32.dll**. They must be in the same folder as the executable.

Once that is done simply modify **web.json** to run locally. The ip and port specified within **web.json** must match the localhost specified within your application's nginx config file. Generally to host for localhost just add **127.0.0.1** for the ip.

After that you can just run the application and you should be able to access it.

If you have trouble deploying then you can always seek help <a href="/help">here</a>.

**Additional Notes:** If you use websockets and deployed with Nginx take a look at <a href="https://www.nginx.com/blog/websocket-nginx/">this</a>. Of course you can skip the <b>node.js</b> part.

## Deploying with Heroku

<a href="https://www.heroku.com/">
  <img src="https://www-assets3.herokucdn.com/assets/logo-purple-08fb38cebb99e3aac5202df018eb337c5be74d5214768c90a8198c97420e4201.svg" alt="Heroku" style="width: 33%; max-height: 258px;">
</a>

This tutorial is based on <a href="https://tour.dlang.org/tour/en/vibed/deploy-on-heroku">this (Raw vibe.d deployment.)</a>.

Before you can deploy with Heroku you need to have a Heroku account, git installed and your project must be able to compile with **dub build**.

Heroku provides an environment variable for the port.

Since Diamond statically binds to a port by default you need to create an extension to modify the vibe.d HTTPServerSettings.

See <a href="/docs/extensions/#http-settings">this</a>.

Once you have your extension you simply set the setting's field called **port** to the port given from the environment variable.

```
import std.process : environment;
import std.conv : to;

// Providing 8080 as a default port, in case $PORT hasn't been set.
settings.port = to!ushort(environment.get("PORT", "8080"));
```

You might want to create a procfile which tells Heroku how to start a certain process.

The content of the procfile could look like this:

```
web: ./diamond-app
```

The next thing to do is to login to the Heroku Command Line using the Heroku Toolbelt <a href="https://toolbelt.heroku.com/standalone">here</a>.

After the installation of the toolbelt run the following command:

```
$ heroku login
```

Now go to the Heroku Dashboard <a href="https://dashboard.heroku.com/">here</a>.

You must memorize the name of the app since it has to be used further in the deployment.

As an alternative to the dashboard, you can execute the following command to create an app, which will also give the name of the app.

```
$ heroku create
```

Now to deploy the app directly, you must use git.

First you must execute the following to create a remote git endpoint that the app can be deployed to.

```
$ heroku git:remote -a <APP_NAME>
```

Where **&lt;APP_NAME&gt;** is the name of the app.

To get the remote endpoints you can look in the git config using the following command:

```
$ git remote -v
```

The next thing to do is setting a buildpack.

You can read more about it in Heroku's documentation <a href="https://devcenter.heroku.com/articles/buildpacks">here</a>.

For deployment you can use Martin Nowak's buildpack <a href="https://github.com/MartinNowak/heroku-buildpack-d">here</a>.

By default the buildpack uses DMD, but it's possible to use LDC or GDC by adding a **.d-compiler** file to your project.

To use a buildpack execute the following command:

```
$ heroku buildpacks:set https://github.com/MartinNowak/heroku-buildpack-d
```

Now to deploy with git all you have to do is commit your project and then push it to the remote git endpoint for Heroku.

```
$ git add .
$ git commit -am "My first Diamond deployment to Heroku"
$ git push heroku master
```

To open and run the app execute:

```
$ heroku open
```

For more information look <a href="https://tour.dlang.org/tour/en/vibed/deploy-on-heroku">here</a>.

## Deploying with Microsoft Azure

<a href="http://azure.microsoft.com/">
  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a8/Microsoft_Azure_Logo.svg" alt="Microsoft Azure" style="width: 33%; max-height: 258px;">
</a>

Based on this <a href="https://web.archive.org/web/20161005051730/http://www.codestrokes.com/2015/09/deploying-d-to-azure-webapp/">article</a>.

First you need to go to your Azure portal <a href="https://portal.azure.com/">here</a>.

Then you need to configure it to have FTP, see <a href="https://docs.microsoft.com/en-us/azure/app-service/app-service-deploy-ftp">this</a>.

Diamond uses a static port for binding which will not work with Azure, so we need to extend the vibe.d HTTPServerSettings and set its port to the port we get from IIS.

First see <a href="/docs/extensions/#http-settings">this</a> for the implementation of the extension.

After that you simply get the port from the environment variable that IIS has placed the port in.

```
import std.process : environment;
import std.conv : to;

// Providing 8080 as a default port, in case HTTP_PLATFORM_PORT hasn't been set.
settings.port = to!ushort(environment.get("HTTP_PLATFORM_PORT", "8080"));
```

The next thing to do is to create a **web.config** file which we'll use to tell IIS how to run our app.

```
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
	<system.webServer>
		<handlers>
			<add name="httpplatformhandler" path="*" verb="*" modules="httpPlatformHandler" resourceType="Unspecified" />
		</handlers>
		<httpPlatform processPath="PATH_TO_THE_APP"
					arguments=""
					startupTimeLimit="60">
			<environmentVariables>
			</environmentVariables>
		</httpPlatform>
	</system.webServer>
</configuration>
```

Change **PATH_TO_THE_APP** to the path to the app.

Now all you have to do is upload the files related to your app.

The files you need are the compiled executable, all folders with static files and then your config folder, but it's only necessary to deploy the **web.json** file from your config folder.

Files such as **views.config** are not necessary to distribute with the compiled application.

On top of that you may also need to deploy libraries that are compiled with your executable.

For Windows that would be **libeay32.dll** and **ssleay32.dll**. They must be in the same folder as the executable.

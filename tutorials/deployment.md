# Deployment

Once your application is finished and ready for production, then deploying it the correct way is important.

## Deploying with Nginx

First download and install Nginx which can be found <a href="http://nginx.org/">here</a>.

Nginx works with Windows, Linux &amp; macOS.

We suggest to use Nginx with a Linux server, but running it on a Windows server works fine.

After it has been installed go into its installation folder, then into the folder named *conf* and open the file called *nginx.conf*

Now find the *http { }* section and add the following entry:

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

After that is done go into the folder within the *conf* called *sites-enabled*.

If the folder doesn't exist then create it.

The *sites-enabled* folder is the folder that contains configurations for all sites you have deployed.

Basically you just place custom *.conf* files within that folder.

It's recommended that the name of the file is the domain of the deployed site.

Ex. *diamondmvc.org* would be *diamondmvc_org.conf*

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

Simply change *DOMAIN* to the domain of your site and change *LOCALHOST* to the local url of your application.

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

Within that folder you just deploy the executable to run, all folders with static files and then your config folder, but it's only necessary to deploy the *web.json* file from your config folder.

Files such as *views.config* are not necessary to distribute with the compiled application.

On top of that you may also need to deploy libraries that are compiled with your executable.

For Windows that would be *libeay32.dll* and *ssleay32.dll*. They must be in the same folder as the executable.

Once that is done simply modify *web.json* to run locally. The ip and port specified within *web.json* must match the localhost specified within your application's nginx config file. Generally to host for localhost just add *127.0.0.1* for the ip.

After that you can just run the application and you should be able to access it.

If you have trouble deploying then you can always seek help <a href="/help">here</a>.

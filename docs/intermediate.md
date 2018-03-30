# Intermediate

Before you can start using Diamond you must go through the basics of how Diamond work and how a project is setup and structured.

## Basics

The first thing to understand about Diamond is the tools necessary to use it.

Diamond is fairly light-weight and doesn't have many dependencies itself.
Diamond depends on a *D compiler*, *DUB*, *vibe.d* and *mysql-native*.

You can get more information about tools etc. <a href="http://127.0.0.1:8080/download">here</a>.

Once you have downloaded and installed a D compiler, as well DUB, please continue to next section.

## Project Setup

A Diamond project has a simple structure.

Before we dive into the project structure, download the empty project found <a href="http://127.0.0.1:8080/download">here</a>.

### dub.json

This file is used to configure the compiler and how the project is compiled.
Generally you don't need to modify this file, unless you need to change version flags or update dependencies.

You might want to edit it and change the output name though.

### /config

This folder is used for configurations that Diamond uses either during compilation or at run-time.

It contains two files by default called *web.json* and *views.config*.

#### - /config/web.json

The file *web.json* is used to specify configurations for Diamond during run-time and how the server should be configured.

#### - /config/views.config

The file *views.config* is used to specify which views Diamond should compile.

It's possible to write a tool or shell that automatically fetches views from the *views* folder and writes them to the *views.config* file, but it's not something we have a guide-line on.

### /controllers

The folder *controllers* is used to hold all your controllers.

It contains one file by default called *package.d* which you use to specify all the controllers used by Diamond.

The controllers must be imported as public.

### /core

The folder *core* is used to specify core code files that you use in the project.

By default this folder contains one file called *websettings.d* which can be used to handle certain web configurations at run-time.

More about that later, since it's covered in a lot other topics and it's not something you need to worry about at this point.

### /models

The folder *models* is used to hold modules for models.

By default it contains one file called *package.d*.

The same rules about importing controllers goes for models.

All models must be imported as public.

### /views

The folder *views* is used to specify all views.

All views created here must also be specified in the */config/views.config* file, otherwise Diamond doesn't know which views to compile and use.

### Deployment

It's important to understand when deploying your Diamond project, then you don't need to deploy everything.

You only need to deploy the generated *executable*, *static file folders*, *localization files* and *config/web.json*

You don't need to deploy all the D modules, as they're compiled into the executable.

It's a different way to deploy your project, compared to ex. PHP, but that's because Diamond is compiled and that's where Diamond gets is speed and performance from.

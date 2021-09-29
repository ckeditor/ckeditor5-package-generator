Create CKEditor 5 Plugin
========================

`create-ckeditor5-plugin` is a tool for plugins creators that creates a new package with the development environment that allows creating a new plugin for CKEditor 5.. 

## Table of contents

* [Creating a package](#creating-a-package)
* [Developing the package](#developing-the-package)
  * [Modifiers](#modifiers)

## Creating a package

To create a new package, execute the following command:

```bash
npx create-ckeditor5-plugin <packageName> [--verbose] [--use-npm]
```

The `<packageName>` argument is required and must follow these rules:

* The provided name must match the schema: `@organization/ckeditor5-*`, where `@organization` is the [scope](https://docs.npmjs.com/about-scopes) of the package.
* The package name must start with the `ckeditor5-` prefix.

As a result of executing the command, a new directory with a package will be created. The directory's name will be equal to the specified package name without the `@organization` part, and it will contain an example plugin and the development environment.

### Modifiers

* `--verbose` - (alias: `-v`) whether to prints additional logs about the current executed task.
* `--use-npm` - whether to use `npm` instead of `yarn` when installing dependencies in a newly created package.

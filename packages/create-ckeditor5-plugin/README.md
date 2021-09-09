Create CKEditor 5 Plugin
========================

`create-ckeditor5-plugin` is a tool for creating a package with a plugin for CKEditor 5.

## Table of contents

* [Creating a package](#creating-a-package)
* [Developing the package](#developing-the-package)

## Creating a package

To create a new plugin, call the following command:

```bash
npx create-ckeditor5-plugin <packageName>
```

The `<packageName>` argument is obligatory and must follow a few rules:

* The provided name must match the schema: `@organization/ckeditor5-package`
  * `@organization` is a [scope](https://docs.npmjs.com/about-scopes) of the package,
* The package name must start with the `ckeditor5-` prefix. 

As a result of executing the command, a new directory with a package will be created. The directory's name will be equal to the specified package name without the `@scope` part, and it will contain an example plugin and development environment.

## Developing the package

Once your package is generated, you can change your working directory to that of the package, and use the available scripts:

* `test` - allow executing tests for the package. Available modifiers:
    * `--coverage` - to create the code coverage report,
    * `--watch` - to observe the source files (the command does not end after executing tests)
    * `--source-map` - to generate source maps of sources,
    * `--verbose` - to print additional webpack logs.
* `dll:build` - builds the DLL version of the package,
* `lint` - verifies code style in `*.js` files,
* `start` - starts a server that allows manual testing of the plugin.

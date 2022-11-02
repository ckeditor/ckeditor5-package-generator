CKEditor 5 Package Generator
============================

The `ckeditor5-package-generator` is a tool for developers, and it creates a working package with the development environment that allows writing new plugins for CKEditor 5.

## Table of contents

* [Requirements](#requirements)
* [Creating a package](#creating-a-package)
  * [Modifiers](#modifiers)

## Requirements

Due to the upcoming end of long-term support for `Node.js 12` in [April 2022](https://nodejs.org/en/about/releases/), the minimal version of `Node.js` required by CKEditor 5 Package Generator is `14`. And while not necessary, it is also nice to have the latest version of `yarn 1.x` installed globally.

## Creating a package

To create a new package, execute the following command:

```bash
npx ckeditor5-package-generator <packageName> [--dev] [--verbose] [--use-npm] [--use-yarn] [--name]
```

The `<packageName>` argument is required and must follow these rules:

* The provided name must match the schema: `@scope/ckeditor5-*`, where [@scope](https://docs.npmjs.com/about-scopes) is an owner of the package.
* The package name must start with the `ckeditor5-` prefix.

As a result of executing the command, a new directory with a package will be created. The directory's name will be equal to the specified package name without the `@scope` part, and it will contain an example plugin and the development environment.

### Modifiers

* `--verbose` &ndash; (alias: `-v`) whether to prints additional logs about the current executed task.
* `--dev` &ndash; whether to execute in the development mode. It means that the `@ckeditor/ckeditor5-package-tools` will not be installed from npm, but from the local file system.
* `--use-npm` &ndash; whether to use `npm` to install dependencies in a newly created package.
* `--use-yarn` &ndash; whether to use `yarn` to install dependencies in a newly created package.
* `--name` &ndash; allows class name to be different from the package name.

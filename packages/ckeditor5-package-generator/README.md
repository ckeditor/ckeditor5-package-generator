CKEditor 5 Package Generator
============================

The `ckeditor5-package-generator` is a tool for developers. It creates a working package with the development environment that allows writing new custom plugins for CKEditor 5.

## Table of contents

* [Requirements](#requirements)
* [Creating a package](#creating-a-package)
  * [Modifiers](#modifiers)

## Requirements

Due to the end of long-term support for `Node.js 12` in [April 2022](https://nodejs.org/en/about/releases/), the minimal version of `Node.js` required by CKEditor 5 Package Generator is `14`. And while not necessary, it is also nice to have the latest version of `yarn 1.x` installed globally.

## Creating a package

To create a new package without installing the tool, simply execute the following command:

```bash
npx ckeditor5-package-generator <packageName> [--use-npm] [--use-yarn] [--name <...>] [--lang <js|ts>] [--verbose]
```

The `<packageName>` argument is required and must obey these rules:

* The provided name must match the schema: `@scope/ckeditor5-*`, where [@scope](https://docs.npmjs.com/about-scopes) is the owner of the package.
* The package name must start with the `ckeditor5-` prefix.
* Allowed characters are numbers (`0-9`), lowercase letters (`a-z`) and symbols: `-` `.` `_`.

As a result of executing the command, a new directory with a package in it will be created. The directory's name will be equal to the specified package name without the `@scope` part, and it will contain an example plugin and the development environment.

### Modifiers

* `--use-npm` &ndash; use `npm` to install dependencies in a newly created package.
* `--use-yarn` &ndash; use `yarn` to install dependencies in a newly created package.
* `--name` &ndash; define a class name to be different from the package name.
* `--lang` &ndash; (values: `js` | `ts`) choose whether the created package should use JavaScript or TypeScript. If omitted, the script will ask the user to choose manually.
* `--verbose` &ndash; (alias: `-v`) print additional logs about the current executed task.

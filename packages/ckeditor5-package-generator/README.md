CKEditor 5 Package Generator
============================

The `ckeditor5-package-generator` is a tool dedicated for developers. It creates a working package with the development environment that allows for developing plugins for CKEditor 5.

## Table of contents

* [Requirements](#requirements)
* [Creating a package](#creating-a-package)
  * [Modifiers](#modifiers)
* [What's next?](#whats-next)

## Requirements

The minimal version of `Node.js` required by CKEditor 5 is `18`.

While not necessary, it is also nice to have the latest version of `yarn 1.x` installed globally.

## Creating a package

To create a new package without installing the tool, simply execute the following command:

```bash
npx ckeditor5-package-generator <packageName> [--use-npm] [--use-yarn] [--use-only-new-installation-methods] [--plugin-name <...>] [--lang <js|ts>] [--verbose]
```

The `<packageName>` argument is required and  must follow these rules:

* The provided name must match the schema: `@scope/ckeditor5-*`, where [@scope](https://docs.npmjs.com/about-scopes) is the owner of the package.
* The package name must start with the `ckeditor5-` prefix.
* Allowed characters are numbers (`0-9`), lowercase letters (`a-z`) and the following symbols: `-` `.` `_`.

If you want the plugin name to be different from the package name, you can use the `--plugin-name` modifier that must follow these rules:

* It cannot start with a number.
* The only allowed characters are numbers (`0-9`), lowercase and uppercase letters (`A-z`) and the underscore (`_`).

As a result of executing the command, a new directory with a package in it will be created. The directory's name will be equal to the specified package name without the `@scope` part, and it will contain an example plugin and the development environment.

### Modifiers

* `--use-npm` &ndash; use `npm` to install dependencies in a newly created package.
* `--use-yarn` &ndash; use `yarn` to install dependencies in a newly created package.
* `--use-only-new-installation-methods` &ndash; use only new installation methods in a newly created package.
* `--plugin-name` &ndash; define a class name to be different from the package name.
* `--lang` &ndash; (values: `js` | `ts`) choose whether the created package should use JavaScript or TypeScript. If omitted, the script will ask the user to choose it manually.
* `--verbose` &ndash; (alias: `-v`) print additional logs about the current executed task.

## What's next

Once the package is created, you are ready to start developing new CKEditor 5 features. You can check out these helpfull guides, too:

* Find out what is available inside your package depending on the language you used:
  * [JavaScript](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/plugins/package-generator/javascript-package.html).
  * [TypeScript](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/plugins/package-generator/typescript-package.html).
* [How to create a simple plugin for CKEditor 5](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/plugins/simple-plugin/abbreviation-plugin-level-1.html).
* [Introduction to CKEditor 5 architecture](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/architecture/intro.html).

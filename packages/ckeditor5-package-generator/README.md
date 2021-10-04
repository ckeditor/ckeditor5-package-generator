CKEditor 5 Package Generator
============================

The `ckeditor5-package-generator` is a tool for developers, and it creates a working package with the development environment that allows writing new plugins for CKEditor 5.

## Table of contents

* [Creating a package](#creating-a-package)
* [Developing the package](#developing-the-package)
  * [Modifiers](#modifiers)

## Creating a package

To create a new package, execute the following command:

```bash
npx ckeditor5-package-generator <packageName> [--verbose] [--use-npm]
```

The `<packageName>` argument is required and must follow these rules:

* The provided name must match the schema: `@scope/ckeditor5-*`, where [@scope](https://docs.npmjs.com/about-scopes) is an owner of the package.
* The package name must start with the `ckeditor5-` prefix.

As a result of executing the command, a new directory with a package will be created. The directory's name will be equal to the specified package name without the `@scope` part, and it will contain an example plugin and the development environment.

### Modifiers

* `--verbose` &ndash; (alias: `-v`) whether to prints additional logs about the current executed task.
* `--use-npm` &ndash; whether to use `npm` instead of `yarn` when installing dependencies in a newly created package.

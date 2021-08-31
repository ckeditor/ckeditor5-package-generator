Create CKEditor 5 Plugin
========================

[![npm version](https://badge.fury.io/js/create-ckeditor5-plugin.svg)](https://badge.fury.io/js/create-ckeditor5-plugin)

`create-ckeditor5-plugin` is a tool for creating a package with a plugin for CKEditor 5.

## Table of contents

* [Creating a package](#creating-a-package)
   * [Options](#options)
* [Developing the package](#developing-the-package)
* [Developing the tool](#developing-the-tool)
* [Release](#release)
* [License](#license)

## Creating a package

Before starting, make sure you have cloned the repository because the tool's code is not available on npm yet.

* Clone the repository: `git clone git@github.com:ckeditor/create-ckeditor5-plugin.git`
* Install the package dependencies: `cd create-ckeditor5-plugin && yarn install`

Then, to create a new plugin, call the `create-ckeditor5-plugin` executable file. It requires a single argument which is the package name. It must follow the schema: `@organization/ckeditor5-package`, which `@organization` is a [scope](https://docs.npmjs.com/about-scopes) of the package, and `ckeditor5-package` is the package name. It must start with the `ckeditor5-` prefix.

The tool will create a new directory called `@organization/ckeditor5-package` with an initial plugin and tools for developing it inside.

```bash
node /path/to/repository/packages/create-ckeditor5-plugin <directory>
```

### Options

* `--verbose` - (alias: `-v`) whether to prints additional logs

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

TODO: Mention the difference with specifying modifiers when using npm and Yarn.

## Developing the tool

TBA

## Release

TBA

## License

TBA

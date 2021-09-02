Create CKEditor 5 Plugin
========================

`create-ckeditor5-plugin` is a tool for creating a package with a plugin for CKEditor 5.

## Table of contents

* [Creating a package](#creating-a-package)
   * [Options](#options)
* [Developing the package](#developing-the-package)
   * [Using modifiers](#using-modifiers)
* [Developing the tool](#developing-the-tool)

## Creating a package

To create a new plugin, call the `create-ckeditor5-plugin` executable file. It requires a single argument which is the package name. It must follow the schema: `@organization/ckeditor5-package`, which `@organization` is a [scope](https://docs.npmjs.com/about-scopes) of the package, and `ckeditor5-package` is the package name. It must start with the `ckeditor5-` prefix.

The tool will create a new directory called `@organization/ckeditor5-package` with an initial plugin and tools for developing it inside.

To use a local version of the `@ckeditor/ckeditor5-package-tools` package, use the `--dev` option when executing the command.

```bash
node /path/to/repository/packages/create-ckeditor5-plugin <directory> --dev
```

### Options

* `--verbose` - (alias: `-v`) whether to prints additional logs.
* `--dev` - whether to execute in the development mode. It means that the `@ckeditor/ckeditor5-package-tools` will not be installed from npm, but from the local file system.

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

### Using modifiers

Keep in mind that the way you use modifiers depends on which package managed you use. `yarn` takes modifiers directly after the script name, while `npm` requires additional `--` separator. That separator ensures that options for `npm` and for the scipt do not mix up.

Using `yarn`:
```
yarn run test --coverage
```
Using `npm`
```
npm run test -- --coverage
```

## Developing the tool

When creating a new package with the `--dev` option, the local version of the `@ckeditor/ckeditor5-package-tools` will be installed instead of its npm version.

However, applying changes in the repository does not impact the created package. Hence, you need to create a [link])(https://docs.npmjs.com/cli/link/) between the repository and the new package.

```bash
# The assumption here is your current working directory points to the root directory in the repository.

cd packages/ckeditor5-package-tools
yarn link

cd /path/to/new/package/ckeditor5-foo
yarn link @ckeditor/ckeditor5-package-tools
```

Now, changes in the repository will be synchronized with the new package.

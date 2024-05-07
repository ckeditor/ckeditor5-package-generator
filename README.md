CKEditor 5 Package Generator
========================

[![CircleCI](https://circleci.com/gh/ckeditor/ckeditor5-package-generator.svg?style=shield)](https://app.circleci.com/pipelines/github/ckeditor/ckeditor5-package-generator?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/ckeditor/ckeditor5-package-generator/badge.svg?branch=master)](https://coveralls.io/github/ckeditor/ckeditor5-package-generator?branch=master)

This repository follows the mono-repository structure. It contains multiple npm packages.

## Table of contents

* [Packages](#packages)
* [Develop the `ckeditor5-package-generator` repository](#develop-the-ckeditor5-package-generator-repository)
  * [Creating a package](#creating-a-package)
    * [Options](#options)
    * [Developing the package](#developing-the-package)
  * [Developing tools in the repository](#developing-tools-in-the-repository)
* [Releasing packages](#releasing-packages)
* [License](#license)

## Packages

<table>
<thead>
	<tr>
		<th width="30%">Name</th>
		<th width="15%">Version</th>
		<th width="55%">Description</th>
	</tr>
</thead>
<tbody>

<tr>
	<td>
		<a href="/packages/ckeditor5-package-generator"><code>ckeditor5-package-generator</code></a>
	</td>
	<td>
		<a href="https://badge.fury.io/js/ckeditor5-package-generator"><img src="https://badge.fury.io/js/ckeditor5-package-generator.svg" alt="npm version" height="18"></a>
	</td>
	<td>
		The tool for creating CKEditor 5 packages.
	</td>
</tr>

<tr>
	<td>
		<a href="/packages/ckeditor5-package-tools"><code>@ckeditor/ckeditor5-package-tools</code></a>
	</td>
	<td>
		<a href="https://badge.fury.io/js/@ckeditor%2Fckeditor5-package-tools"><img src="https://badge.fury.io/js/@ckeditor%2Fckeditor5-package-tools.svg" alt="npm version" height="18"></a>
	</td>
	<td>
		Development environment tools for CKEditor 5 packages.
	</td>
</tr>

</tbody>
</table>

## Developing the `ckeditor5-package-generator` repository

* Clone the repository: `git clone git@github.com:ckeditor/ckeditor5-package-generator.git`
* Install required dependencies: `yarn install`

### Creating a package

To create a new package, call the `ckeditor5-package-generator` executable file. It requires a single argument which is the package name. It must follow the schema: `@scope/ckeditor5-package`, where [@scope](https://docs.npmjs.com/about-scopes) is an owner of the package, and `ckeditor5-package` is the package name. It must start with the `ckeditor5-` prefix.

The tool will create a new directory called `ckeditor5-package` with an example plugin called `Package` and tools for its development.

To use a local version of the `@ckeditor/ckeditor5-package-tools` package, use the `--dev` option when executing the command.

```bash
node /path/to/repository/packages/ckeditor5-package-generator <packageName> [--dev] [--use-npm] [--use-yarn] [--use-legacy-methods] [--name <...>] [--lang <js|ts>] [--verbose]
```

#### Options

* `--dev` &ndash; whether to execute in the development mode. It means that the `@ckeditor/ckeditor5-package-tools` will not be installed from npm, but from the local file system.
* `--use-npm` &ndash; use `npm` to install dependencies in a newly created package.
* `--use-yarn` &ndash; use `yarn` to install dependencies in a newly created package.
* `--use-legacy-methods` &ndash; use old installations methods in a newly created package. [TODO: Link to DLLs documentation??]
* `--name` &ndash; define a class name to be different from the package name.
* `--lang` &ndash; (values: `js` | `ts`) choose whether the created package should use JavaScript or TypeScript. If omitted, the script will ask the user to choose manually.
* `--verbose` &ndash; (alias: `-v`) print additional logs about the current executed task.

#### Developing the package

Available scripts and their modifiers are described in the [`README.md` file of the `ckeditor5-package-generator` package](/packages/ckeditor5-package-generator).

#### Package metadata

The `ckeditor5-metadata.json` file contains data of the package that allows for an automated detection of plugins and processing them by external scripts. Information about how this file should be maintained is available in the [official guide](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/contributing/package-metadata.html). Keep in mind that this file has no effect on how the plugin work.

### Developing tools in the repository

When creating a new package with the `--dev` option, the local version of the `@ckeditor/ckeditor5-package-tools` will be installed instead of its npm version.

However, applying changes in the local repository does not impact an already created package. Hence, you need to create a [link](https://docs.npmjs.com/cli/link/) between the local repository and the new package.

```bash
# The assumption here is your current working directory points to the root directory in the repository.
cd packages/ckeditor5-package-tools
yarn link

# Then, go to the newly created package.
cd /path/to/new/package/ckeditor5-foo
yarn link @ckeditor/ckeditor5-package-tools
```

Now, the newly created package uses changes from the local repository.

## Releasing packages

### Changelog

1. Fetch all changes and switch to the `#master` branch.
2. Execute `npm run changelog`:

  * Scan the logs printed by the tool – search for errors (incorrect changelog entries). Incorrect entries (e.g., ones without the type) are being ignored. You may need to create entries for them manually. This is done directly in `CHANGELOG.md` (in the root directory). Make sure to verify the proposed version after you modify the changelog.
  * When unsure what has changed in this version of a specific package, use `git diff <hash of the previous release> packages/<name>/`.

### Publishing

After generating the changelog, you are ready for publishing packages.

First, you need to bump their versions:

```bash
npm run release:prepare-packages
```

After bumping versions, you can publish changes:

```bash
npm run release:publish-packages
```

## License

The `ckeditor5-package-generator` tool is available under [MIT license](https://opensource.org/licenses/MIT).

All packages created with the tool are also available under the MIT license.

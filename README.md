CKEditor 5 Package Generator
========================

[![Build Status](https://travis-ci.com/ckeditor/ckeditor5.svg?branch=master)](https://travis-ci.com/ckeditor/ckeditor5-package-generator)

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

To create a new package, call the `ckeditor5-package-generator` executable file. It requires a single argument which is the package name. It must follow the schema: `@organization/ckeditor5-package`, where `@organization` is a [scope](https://docs.npmjs.com/about-scopes) of the package, and `ckeditor5-package` is the package name. It must start with the `ckeditor5-` prefix.

The tool will create a new directory called `@organization/ckeditor5-package` with an initial package and tools for developing it inside.

To use a local version of the `@ckeditor/ckeditor5-package-tools` package, use the `--dev` option when executing the command.

```bash
node /path/to/repository/packages/ckeditor5-package-generator <packageName> [--dev] [--verbose] [--use-npm]
```

#### Options

* `--verbose` - (alias: `-v`) whether to prints additional logs about the current executed task.
* `--dev` - whether to execute in the development mode. It means that the `@ckeditor/ckeditor5-package-tools` will not be installed from npm, but from the local file system.
* `--use-npm` - whether to use `npm` instead of `yarn` when installing dependencies in a newly created package.

#### Developing the package

Available scripts and their modifiers are described in the [`README.md` file of the `ckeditor5-package-generator` package](/packages/ckeditor5-package-generator).

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

1. Fetch all changes and switch to the `##master` branch.
2. Execute `npm run changelog`:

  * Scan the logs printed by the tool – search for errors (incorrect changelog entries). Incorrect entries (e.g., ones without the type) are being ignored. You may need to create entries for them manually. This is done directly in `CHANGELOG.md` (in the root directory). Make sure to verify the proposed version after you modify the changelog.
  * When unsure what has changed in this version of a specific package, use `git diff <hash of the previous release> packages/<name>/`.

### Publishing

After generating the changelog, you are ready for publishing packages.

First, you need to bump their versions:

```bash
npm run release:bump-version
```

You can also use the `--dry-run` option to see what this task does.

After bumping versions, you can publish changes:

```bash
npm run release:publish
```

As in the previous task, the `--dry-run` option is also available.

## License

The `ckeditor5-package-generator` tool is available under the [MIT license](https://opensource.org/licenses/MIT).

All packages created with the tool are also available under the MIT license.

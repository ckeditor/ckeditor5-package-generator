Create CKEditor 5 Plugin
========================

[![Build Status](https://travis-ci.com/ckeditor/ckeditor5.svg?branch=master)](https://travis-ci.com/ckeditor/ckeditor5)

This repository follows the mono-repository structure. It contains multiple npm packages.

## Table of contents

* [Packages](#packages)
* [Develop the `create-ckeditor5-plugin` repository](#develop-the-create-ckeditor5-plugin-repository)
  * [Creating a package](#creating-a-package)
    * [Options](#options)
    * [Developing the package](#developing-the-package)
  * [Developing tools in the repository](#developing-tools-in-the-repository)
* [Release](#release)
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
		<a href="/packages/create-ckeditor5-plugin"><code>create-ckeditor5-plugin</code></a>
	</td>
	<td>
		<a href="https://badge.fury.io/js/create-ckeditor5-plugin"><img src="https://badge.fury.io/js/create-ckeditor5-plugin.svg" alt="npm version" height="18"></a>
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

## Developing the `create-ckeditor5-plugin` repository

* Clone the repository: `git clone git@github.com:ckeditor/create-ckeditor5-plugin.git`
* Install required dependencies: `yarn install`

### Creating a package

To create a new plugin, call the `create-ckeditor5-plugin` executable file. It requires a single argument which is the package name. It must follow the schema: `@organization/ckeditor5-package`, where `@organization` is a [scope](https://docs.npmjs.com/about-scopes) of the package, and `ckeditor5-package` is the package name. It must start with the `ckeditor5-` prefix.

The tool will create a new directory called `@organization/ckeditor5-package` with an initial plugin and tools for developing it inside.

To use a local version of the `@ckeditor/ckeditor5-package-tools` package, use the `--dev` option when executing the command.

```bash
node /path/to/repository/packages/create-ckeditor5-plugin <directory> [--dev]
```

#### Options

* `--verbose` - (alias: `-v`) whether to prints additional logs.
* `--dev` - whether to execute in the development mode. It means that the `@ckeditor/ckeditor5-package-tools` will not be installed from npm, but from the local file system.

#### Developing the package

Available scripts and their modifiers are described in the [`README.md` file of the `create-ckeditor5-plugin` package](/packages/create-ckeditor5-plugin).

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

## Release

TBA

## License

The `create-ckeditor5-plugin` tool is available under the [MIT license](https://opensource.org/licenses/MIT).

All packages created with the tool are also available under the MIT license.

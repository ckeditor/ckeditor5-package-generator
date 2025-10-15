CKEditor 5 Package Generator
========================

[![CircleCI](https://circleci.com/gh/ckeditor/ckeditor5-package-generator.svg?style=shield)](https://app.circleci.com/pipelines/github/ckeditor/ckeditor5-package-generator?branch=master)
[![Coverage Status](https://codecov.io/github/ckeditor/ckeditor5-package-generator/graph/badge.svg)](https://codecov.io/github/ckeditor/ckeditor5-package-generator)
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
* Install required dependencies: `pnpm install`

### Creating a package

To create a new package, call the `ckeditor5-package-generator` executable file. It requires a single argument which is the package name. It must follow the schema: `@scope/ckeditor5-package`, where [@scope](https://docs.npmjs.com/about-scopes) is an owner of the package, and `ckeditor5-package` is the package name. It must start with the `ckeditor5-` prefix.

The tool will create a new directory called `ckeditor5-package` with an example plugin called `Package` and tools for its development.

To use a local version of the `@ckeditor/ckeditor5-package-tools` package, use the `--dev` option when executing the command.

```bash
node /path/to/repository/packages/ckeditor5-package-generator <packageName> [--dev] [--use-npm] [--use-yarn] [--use-pnpm] [--installation-methods <current|current-and-legacy>] [--global-name <...>] [--plugin-name <...>] [--lang <js|ts>] [--verbose]
```

#### Options

* `--dev` &ndash; whether to execute in the development mode. It means that the `@ckeditor/ckeditor5-package-tools` package will not be installed from npm, but from the local file system.
* `--use-release-directory` &ndash; whether to use the `release/` directory while resolving a path to the `@ckeditor/ckeditor5-package-tools` dependency. This flag must be used along with `--dev`.
* `--use-npm` &ndash; use `npm` to install dependencies in a newly created package.
* `--use-yarn` &ndash; use `yarn` to install dependencies in a newly created package.
* `--use-pnpm` &ndash; use `pnpm` to install dependencies in a newly created package.
* `--installation-methods` &ndash; (values: `current` | `current-and-legacy`) choose which installation methods of CKEditor 5 do you want to support? If omitted, the script will ask the user to choose manually.
* `--global-name` &ndash; define a global name of the package to be used in UMD build.
* `--plugin-name` &ndash; define a class name to be different from the package name.
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
pnpm link

# Then, go to the newly created package.
cd /path/to/new/package/ckeditor5-foo
pnpm link @ckeditor/ckeditor5-package-tools
```

Now, the newly created package uses changes from the local repository.

## Releasing packages

CircleCI automates the release process and can release both channels: stable (`X.Y.Z`) and pre-releases (`X.Y.Z-alpha.X`, etc.).

Before you start, you need to prepare the changelog entries.

1. Make sure the `#master` branch is up-to-date: `git fetch && git checkout master && git pull`.
1. Prepare a release branch: `git checkout -b release-[YYYYMMDD]` where `YYYYMMDD` is the current day.
1. Generate the changelog entries: `pnpm run release:prepare-changelog`.
	* You can specify the release date by passing the `--date` option, e.g., `--date=2025-06-11`.
	* By passing the `--dry-run` option, you can check what the script will do without actually modifying the files.
	* Read all the entries, correct poor wording and other issues, wrap code names in backticks to format them, etc.
	* Add the missing `the/a` articles, `()` to method names, "it's" -> "its", etc.
	* A newly introduced feature should have just one changelog entry – something like "The initial implementation of the FOO feature." with a description of what it does.
1. Commit all changes and prepare a new pull request targeting the `#master` branch.
1. Ping the `@ckeditor/ckeditor-5-platform` team to review the pull request and trigger the release process.

## License

The `ckeditor5-package-generator` tool is available under [MIT license](https://opensource.org/licenses/MIT).

All packages created with the tool are also available under the MIT license.

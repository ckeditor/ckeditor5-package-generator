Changelog
=========

## [1.0.0-beta.8](https://github.com/ckeditor/ckeditor5-package-generator/compare/v1.0.0-beta.7...v1.0.0-beta.8) (2022-12-20)

### Other changes

* Aligned the project to recent changes in the `ckeditor/ckeditor5-dev` repository. See the [release v32.0.0](https://github.com/ckeditor/ckeditor5-dev/releases/tag/v32.0.0). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/a795cf7f3fc431a8821da0a1dfb6223623096eec))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Other releases:

* [@ckeditor/ckeditor5-package-tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools): v1.0.0-beta.7 => v1.0.0-beta.8
* [ckeditor5-package-generator](https://www.npmjs.com/package/ckeditor5-package-generator): v1.0.0-beta.7 => v1.0.0-beta.8
</details>


## [1.0.0-beta.7](https://github.com/ckeditor/ckeditor5-package-generator/compare/v1.0.0-beta.6...v1.0.0-beta.7) (2022-11-21)

### Features

* The provided package name will now be used as a default name of a plugin (instead of `MyPlugin`) in the generated package. Closes [#54](https://github.com/ckeditor/ckeditor5-package-generator/issues/54). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/0ae33c4ebb7a9fbe21b8bd054164d5b0429b614c))
* Added the `--plugin-name` option that allows specifying the plugin name different from the package name. See [#54](https://github.com/ckeditor/ckeditor5-package-generator/issues/54). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/0ae33c4ebb7a9fbe21b8bd054164d5b0429b614c))

### Other changes

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Added `--use-yarn` flag to package generator to use yarn for installing dependencies in a newly created package. If npm and yarn are installed and no flags are set, user is prompted for a choice. Closes [#120](https://github.com/ckeditor/ckeditor5-package-generator/issues/120). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/0bd2d02b0ecc8f1cadee56c176e8af077b3cc13d))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Releases containing new features:

* [ckeditor5-package-generator](https://www.npmjs.com/package/ckeditor5-package-generator): v1.0.0-beta.6 => v1.0.0-beta.7

Other releases:

* [@ckeditor/ckeditor5-package-tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools): v1.0.0-beta.6 => v1.0.0-beta.7
</details>


## [1.0.0-beta.6](https://github.com/ckeditor/ckeditor5-package-generator/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2022-08-23)

### MAJOR BREAKING CHANGES [ℹ️](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html#major-and-minor-breaking-changes)

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: The program interacts with a user via CLI when asking about a programming language. If the generator is a part of the sub-process of other tasks, it might be blocked. Hence, use the `--lang (ts|js)` option to avoid blocking a process.

### Features

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: The package generator allows choosing a programming language that a developer will use to write a custom feature for CKEditor 5. It can be TypeScript or JavaScript. Closes [#101](https://github.com/ckeditor/ckeditor5-package-generator/issues/101). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/e6689f662e9034c31281af367e7361f09cfebe60))
* **[tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools)**: Added support for loading TypeScript when running automated tests, a manual sample, or preparing a DLL build. ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/e6689f662e9034c31281af367e7361f09cfebe60))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Releases containing new features:

* [@ckeditor/ckeditor5-package-tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools): v1.0.0-beta.5 => v1.0.0-beta.6
* [ckeditor5-package-generator](https://www.npmjs.com/package/ckeditor5-package-generator): v1.0.0-beta.5 => v1.0.0-beta.6
</details>


## [1.0.0-beta.5](https://github.com/ckeditor/ckeditor5-package-generator/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2022-04-12)

### MAJOR BREAKING CHANGES [ℹ️](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html#major-and-minor-breaking-changes)

* **[tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools)**: The `-- transifex [API end-point]` option is no longer supported. Use the following options: `--organization [organization name]` and `--project [project name]` instead.

### Bug fixes

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: When creating a new package, a version of the `@ckeditor/ckeditor5-inspector` package should be taken from the npm registry. Closes [#96](https://github.com/ckeditor/ckeditor5-package-generator/issues/96). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/34a4f05be00895015478ca5edb8320fbba4d9b1b))
* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Removed the `isToggleable` property from the plugin template. Closes [#97](https://github.com/ckeditor/ckeditor5-package-generator/issues/97). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/fee3d7155fbf744ab63b8a6d274d57d5d7f08464))

### Other changes

* **[tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools)**: Bumped Karma test runner to v6.x. Closes [#92](https://github.com/ckeditor/ckeditor5-package-generator/issues/92). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/4e8461dfb10d27e44a5aa75fd2e0a898263116c6))
* **[tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools)**: Aligned the translations tools to the new API exported by the `@ckeditor/ckeditor5-dev-env` package. Closes [#71](https://github.com/ckeditor/ckeditor5-package-generator/issues/71). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/2817b210190fc060bfadd2cc780be5c712bdb733))
* Packages generated by the tool use PostCSS@8 now. See [ckeditor/ckeditor5#11460](https://github.com/ckeditor/ckeditor5/issues/11460). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/d57cc3ed01e259cf4140119ecae902de3f1cb526))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Other releases:

* [@ckeditor/ckeditor5-package-tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools): v1.0.0-beta.4 => v1.0.0-beta.5
* [ckeditor5-package-generator](https://www.npmjs.com/package/ckeditor5-package-generator): v1.0.0-beta.4 => v1.0.0-beta.5
</details>


## [1.0.0-beta.4](https://github.com/ckeditor/ckeditor5-package-generator/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2022-01-28)

### Bug fixes

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Added the missing `webpack` dependency to the `package.json` file. It fixes the _Cannot find module 'webpack'_ error. The `@ckeditor/ckeditor5-dev-utils` dependency defines peer dependencies, which must be installed manually in the generator package. Closes [#89](https://github.com/ckeditor/ckeditor5-package-generator/issues/89). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/1321fe75e34aeeaf33dd4beb5704f7788493f46b))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Other releases:

* [@ckeditor/ckeditor5-package-tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools): v1.0.0-beta.3 => v1.0.0-beta.4
* [ckeditor5-package-generator](https://www.npmjs.com/package/ckeditor5-package-generator): v1.0.0-beta.3 => v1.0.0-beta.4
</details>


## [1.0.0-beta.3](https://github.com/ckeditor/ckeditor5-package-generator/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2022-01-11)

### MAJOR BREAKING CHANGES [ℹ️](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html#major-and-minor-breaking-changes)

* Upgraded the minimal versions of Node.js to `14.0.0` due to the end of LTS.

### Features

* **[tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools)**: Introduced tools that allow collecting, uploading, and downloading translation files from Transifex. Closes [#9](https://github.com/ckeditor/ckeditor5-package-generator/issues/9). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/d5acd18593a146cdfbb46b160a50ef8f5f0453ac))

### Bug fixes

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Improved the error messages. Closes [#62](https://github.com/ckeditor/ckeditor5-package-generator/issues/62). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/70d29a1ea02b8df6d0ba31cadb01e700e6f6acb3))

### Other changes

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Upgraded the `http-server` package to the latest version to fix a problem with starting the HTTP server for DLL files. Closes [#87](https://github.com/ckeditor/ckeditor5-package-generator/issues/87). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/e769c3d7c5ff464989d7106131b1c26f079b8dd8))
* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Improved an error when no package name was specified during the command execution. Closes [#72](https://github.com/ckeditor/ckeditor5-package-generator/issues/72). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/d3282393bc6342a07489a8646ee3887aa15334d5))
* **[tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools)**: Project migration to webpack 5. Closes [#56](https://github.com/ckeditor/ckeditor5-package-generator/issues/56). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/94ffa51a1a90eff1b8059bf410706e52fc207e8d))
* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**:Enabled verifying a commit using husky in a newly created package. Closes [#59](https://github.com/ckeditor/ckeditor5-package-generator/issues/59). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/853347ef0f5e26d1c10b8b9afe7ce464d537a5a3))
* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Enabled inspector in the manual test sample. Closes [#58](https://github.com/ckeditor/ckeditor5-package-generator/issues/58). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/5f5f0f0722e5a917d65219dec0ec9bb1822877ee))
* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Added `ckeditor5-metadata.json` file in template files. Closes [#46](https://github.com/ckeditor/ckeditor5-package-generator/issues/46). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/a554526a4deac55c6634b58504875c714891cea8))
* Updated the required version of Node.js to 14. See [ckeditor/ckeditor5#10972](https://github.com/ckeditor/ckeditor5/issues/10972). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/e56d47437c653adfc3284fe969eeeddde72346ef))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Releases containing new features:

* [@ckeditor/ckeditor5-package-tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools): v1.0.0-beta.2 => v1.0.0-beta.3
* [ckeditor5-package-generator](https://www.npmjs.com/package/ckeditor5-package-generator): v1.0.0-beta.2 => v1.0.0-beta.3
</details>


## [1.0.0-beta.2](https://github.com/ckeditor/ckeditor5-package-generator/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2021-10-26)

### MAJOR BREAKING CHANGES [ℹ️](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html#major-and-minor-breaking-changes)

* Renamed the `sample/script.js` file to `sample/ckeditor.js` and aligned webpack configuration.

### Features

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Added a spinner when installing packages. Closes [#52](https://github.com/ckeditor/ckeditor5-package-generator/issues/52). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/1792fddf7ef1a80c8e77fdcbb9638fcb06ba22e2))

### Bug fixes

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Changed how arguments are specified for the `lint` task due to errors on Windows environments. Closes [#65](https://github.com/ckeditor/ckeditor5-package-generator/issues/65). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/60d7b95b8f4edea13386bb0ecda460a35b885b8b))
* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Created the `.gitignore` file when generating a new package. Closes [#50](https://github.com/ckeditor/ckeditor5-package-generator/issues/50). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/18394eb0f4a3d2ef98a2c77c673107c3291db5bd))

### Other changes

* Renamed the script that produces the demo/sample. Now it is called `ckeditor.js` and matches to official CKEditor 5 builds. Closes [#49](https://github.com/ckeditor/ckeditor5-package-generator/issues/49). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/1b3a1cda064a33ccea356ec6fa26594a0582e612))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Releases containing new features:

* [ckeditor5-package-generator](https://www.npmjs.com/package/ckeditor5-package-generator): v1.0.0-beta.1 => v1.0.0-beta.2

Other releases:

* [@ckeditor/ckeditor5-package-tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools): v1.0.0-beta.1 => v1.0.0-beta.2
</details>


## [1.0.0-beta.1](https://github.com/ckeditor/ckeditor5-package-generator/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2021-10-04)

### Bug fixes

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Added a missing "bin" script in package.json. Closes [#45](https://github.com/ckeditor/ckeditor5-package-generator/issues/45). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/c626ea80323f8fbdb81d01a59a3cad3b6195e1d1))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Other releases:

* [@ckeditor/ckeditor5-package-tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools): v1.0.0-beta.0 => v1.0.0-beta.1
* [ckeditor5-package-generator](https://www.npmjs.com/package/ckeditor5-package-generator): v1.0.0-beta.0 => v1.0.0-beta.1
</details>


## [1.0.0-beta.0](https://github.com/ckeditor/ckeditor5-package-generator/compare/v0.0.1...v1.0.0-beta.0) (2021-10-04)

We are happy to announce the first release of `ckeditor5-package-generator`.

This tool allows creating a working package with the development environment to write new plugins for CKEditor 5.

For more details on using the tool, please, take a look at the [README.md](https://github.com/ckeditor/ckeditor5-package-generator/blob/master/packages/ckeditor5-package-generator/README.md) file of the `ckeditor5-package-generator` package.

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

New packages:

* [@ckeditor/ckeditor5-package-tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools): v1.0.0-beta.0
* [ckeditor5-package-generator](https://www.npmjs.com/package/ckeditor5-package-generator): v1.0.0-beta.0
</details>

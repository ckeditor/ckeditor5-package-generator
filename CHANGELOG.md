Changelog
=========

## [1.1.0](https://github.com/ckeditor/ckeditor5-package-generator/compare/v1.0.0...v1.1.0) (2023-07-05)

### Features

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: The tool will now display its version when used with `-V`/`--version` option. The version will also be displayed on the `-h`/`--help` message. Closes [#150](https://github.com/ckeditor/ckeditor5-package-generator/issues/150). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/5e00ccbfadcd3b256fc12832fa19cc63745d04d7))

### Bug fixes

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Removed the current working directory from a package manager command when installing dependencies. A new process is already spawned in the directory. Hence, there is no need to duplicate the path. Thanks to that, a space in the path will not crash the generator while installing dependencies. Closes [#156](https://github.com/ckeditor/ckeditor5-package-generator/issues/156). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/35442f436ed746d91e8a3b3b0b32bd0d9762421f))

### Other changes

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: When generating a new package, the generator uses the latest stable CKEditor 5 release. Closes [#155](https://github.com/ckeditor/ckeditor5-package-generator/issues/155). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/40a9b627fb6a02fc361381cd86f119a4e61cddf6))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Releases containing new features:

* [ckeditor5-package-generator](https://www.npmjs.com/package/ckeditor5-package-generator): v1.0.0 => v1.1.0

Other releases:

* [@ckeditor/ckeditor5-package-tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools): v1.0.0 => v1.1.0
</details>


## [1.0.0](https://github.com/ckeditor/ckeditor5-package-generator/compare/v1.0.0-beta.10...v1.0.0) (2023-04-25)

We are happy to announce the first stable release of `ckeditor5-package-generator`.

This tool allows creating a working package with the development environment to write new plugins for CKEditor 5.

For more details on using the tool, please, take a look at the [README.md](https://github.com/ckeditor/ckeditor5-package-generator/blob/master/packages/ckeditor5-package-generator/README.md) file of the `ckeditor5-package-generator` package.

### MAJOR BREAKING CHANGES [ℹ️](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html#major-and-minor-breaking-changes)

* Upgraded the minimal versions of Node.js to `16.0.0` due to the end of LTS.

### Features

* Add `augmentation.ts` to the TypeScript package generator. Closes [ckeditor/ckeditor5-package-generator#144](https://github.com/ckeditor/ckeditor5-package-generator/issues/144). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/f736d0882571ad38d196156d386020f484c9fd62))

### Bug fixes

* **[tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools)**: Added the missing `ts-loader`. Webpack missed it when creating a new package using `npm` as the package manager. Closes [#143](https://github.com/ckeditor/ckeditor5-package-generator/issues/143). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/69bc170b21dc461ad1dd3e5b96be2943117ca49c))
* **[tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools)**: Added support for a package name without an organization prefix. Preparing the DLL build will not throw an error for such a package. Closes [#139](https://github.com/ckeditor/ckeditor5-package-generator/issues/139). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/a820183289fa73c2bba14f98dbfe2ac1ee3a085e))

### Other changes

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Removed the "experimental" label from TS and made it the default choice. Related [#111](https://github.com/ckeditor/ckeditor5-package-generator/issues/111). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/5b82666eee376e8ed2b235b861de50bad512b82b))
* **[tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools)**: Update `terser-webpack-plugin` to enable optional chaining syntax. Closes [#136](https://github.com/ckeditor/ckeditor5-package-generator/issues/136). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/fddaa523edbe7f4cba0b5fe6f6624940fe1a384c))
* Updated the required version of Node.js to 16. ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/9872918528fdfe58ea6b4570c8a1ae55d7c48516))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Releases containing new features:

* [ckeditor5-package-generator](https://www.npmjs.com/package/ckeditor5-package-generator): v1.0.0-beta.10 => v1.0.0

Other releases:

* [@ckeditor/ckeditor5-package-tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools): v1.0.0-beta.10 => v1.0.0
</details>


## [1.0.0-beta.10](https://github.com/ckeditor/ckeditor5-package-generator/compare/v1.0.0-beta.9...v1.0.0-beta.10) (2023-03-28)

### Bug fixes

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Updated the generated packages to use a package entry point when importing plugins. ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/eb57f36747a6bec37ea278f2a397581e080b6dbd))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Other releases:

* [@ckeditor/ckeditor5-package-tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools): v1.0.0-beta.9 => v1.0.0-beta.10
* [ckeditor5-package-generator](https://www.npmjs.com/package/ckeditor5-package-generator): v1.0.0-beta.9 => v1.0.0-beta.10
</details>


## [1.0.0-beta.9](https://github.com/ckeditor/ckeditor5-package-generator/compare/v1.0.0-beta.8...v1.0.0-beta.9) (2023-03-09)

### Features

* Replaced the community typings with the official CKEditor 5. Closes [#110](https://github.com/ckeditor/ckeditor5-package-generator/issues/110). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/f2f8264a6847ac6d0cb5f3aa7c77159134669c7d))

### Other changes

* The `ckeditor5` package is no longer a dependency of a created package. Instead, it is marked as a peer dependency to enable using the newly created package with the latest CKEditor 5 versions. ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/f2f8264a6847ac6d0cb5f3aa7c77159134669c7d))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Releases containing new features:

* [ckeditor5-package-generator](https://www.npmjs.com/package/ckeditor5-package-generator): v1.0.0-beta.8 => v1.0.0-beta.9

Other releases:

* [@ckeditor/ckeditor5-package-tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools): v1.0.0-beta.8 => v1.0.0-beta.9
</details>


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

---

To see all releases, visit the [release page](https://github.com/ckeditor/ckeditor5-package-generator/releases).

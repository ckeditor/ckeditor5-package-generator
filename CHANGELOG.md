Changelog
=========

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

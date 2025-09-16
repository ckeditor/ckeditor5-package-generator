Changelog
=========

## [4.1.0](https://github.com/ckeditor/ckeditor5-package-generator/compare/v4.0.2...v4.1.0) (September 16, 2025)

### Features

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Added comprehensive support for `pnpm` alongside existing `npm` and `yarn` options in the CKEditor 5 package generator. Closes [#247](https://github.com/ckeditor/ckeditor5-package-generator/issues/247).

  Features added:
  - New `--use-pnpm` CLI flag for specifying pnpm as package manager.

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Releases containing new features:

* [ckeditor5-package-generator](https://www.npmjs.com/package/ckeditor5-package-generator/v/4.1.0): v4.0.2 => v4.1.0

Other releases:

* [@ckeditor/ckeditor5-package-tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools/v/4.1.0): v4.0.2 => v4.1.0
</details>


## [4.0.2](https://github.com/ckeditor/ckeditor5-package-generator/compare/v4.0.1...v4.0.2) (July 23, 2025)

### Bug fixes

* **[tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools)**: Fixed various errors thrown when generating packages in a monorepo environment. Closes [ckeditor/ckeditor5-package-generator#132](https://github.com/ckeditor/ckeditor5-package-generator/issues/132).

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Other releases:

* [@ckeditor/ckeditor5-package-tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools/v/4.0.2): v4.0.1 => v4.0.2
* [ckeditor5-package-generator](https://www.npmjs.com/package/ckeditor5-package-generator/v/4.0.2): v4.0.1 => v4.0.2
</details>


## [4.0.1](https://github.com/ckeditor/ckeditor5-package-generator/compare/v4.0.0...v4.0.1) (2025-06-26)

### Other changes

* **[package-tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-package-tools)**: Add support for importing raw file content by appending `?raw` query parameter to import path. Closes [#235](https://github.com/ckeditor/ckeditor5-package-generator/issues/235). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/9fd42b92280ac1e00e1724f619ed774721dcb9bc))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Other releases:

* [@ckeditor/ckeditor5-package-tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools/v/4.0.1): v4.0.0 => v4.0.1
* [ckeditor5-package-generator](https://www.npmjs.com/package/ckeditor5-package-generator/v/4.0.1): v4.0.0 => v4.0.1
</details>


## [4.0.0](https://github.com/ckeditor/ckeditor5-package-generator/compare/v3.0.1...v4.0.0) (2025-06-04)

### MAJOR BREAKING CHANGES [ℹ️](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html#major-and-minor-breaking-changes)

* Updated the required version of Node.js to 22.

### Other changes

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: The Stylelint version in the generated packages has been bumped to v16.x. ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/f6f56b2c5fdab9fddcdd67bf0c9094c6153c8e4c))
* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: The ESLint version in the generated packages has been bumped to v9.x. ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/0167c222d2145f5b4f8140944e2a80faf8d40b5d))
* The development environment of the CKEditor 5 package generator now uses ESLint v9. Therefore, the required Node.js version has been upgraded to 22 to match the ESLint requirements. ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/0167c222d2145f5b4f8140944e2a80faf8d40b5d))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Other releases:

* [@ckeditor/ckeditor5-package-tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools/v/4.0.0): v3.0.1 => v4.0.0
* [ckeditor5-package-generator](https://www.npmjs.com/package/ckeditor5-package-generator/v/4.0.0): v3.0.1 => v4.0.0
</details>


## [3.0.1](https://github.com/ckeditor/ckeditor5-package-generator/compare/v3.0.0...v3.0.1) (2025-01-07)

### Other changes

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: The package generator prompt displays the suggested name for the UMD build. The name is created from the plugin name and prefixed with the `CK`. Closes [#207](https://github.com/ckeditor/ckeditor5-package-generator/issues/207). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/36849a89fc813b0bb40b107dad2239320fea9967))
* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Aligned the UI component name from the generated package to naming convention in CKEditor 5. Closes [#209](https://github.com/ckeditor/ckeditor5-package-generator/issues/209). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/bac30e56a166ab10765918f25d3219a16e3150d8))
* **[package-generator](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-package-generator)**: Added `GPL` license key to the packages created by the generator. Closes [#201](https://github.com/ckeditor/ckeditor5-package-generator/issues/201). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/da1f2dec8b26e9e26b8c1c9fbe28deed5377be9f))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Other releases:

* [@ckeditor/ckeditor5-package-tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools/v/3.0.1): v3.0.0 => v3.0.1
* [ckeditor5-package-generator](https://www.npmjs.com/package/ckeditor5-package-generator/v/3.0.1): v3.0.0 => v3.0.1
</details>

---

To see all releases, visit the [release page](https://github.com/ckeditor/ckeditor5-package-generator/releases).

Changelog
=========

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


## [3.0.0](https://github.com/ckeditor/ckeditor5-package-generator/compare/v2.1.1...v3.0.0) (2024-11-04)

We are excited to announce an update to the package generator for CKEditor 5 plugins. Starting this release, the created packages use [Vitest](https://vitest.dev/) as a testing environment for automated tests.

Taking the occasion, we decided to drop the Transifex integration. Right now, translation entries (if needed) can be modified via pull requests instead of an external service. This change reflects the translation updates in CKEditor 5.

Last but not least, the generator follows the ESM standard. However, this change should not affect the integrators, as the [`@ckeditor/ckeditor5-package-tools`](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools) package exposes a binary script that is aligned to the new API.

### MAJOR BREAKING CHANGES [ℹ️](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html#major-and-minor-breaking-changes)

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Removed the `translations:collect`, `translations:download` and `translations:upload` scripts from the generated package. Instead, the `translations:synchronize` and `translations:validate` scripts are introduced. These two new scripts do not provide an integration with Transifex service anymore, but they help preparing translation files (`*.po` files) which must be handled by the integrator himself.
* **[tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools)**: Removed the `translations:collect`, `translations:download` and `translations:upload` tasks. Instead, the `translations:synchronize` task is introduced. It helps preparing translation files (`*.po` files) in the generated package.

### MINOR BREAKING CHANGES [ℹ️](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html#major-and-minor-breaking-changes)

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: The generated package no longer uses Karma as the test runner. Instead, Vitest is used.
* **[tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools)**: The `test` script is removed, because unit tests in the generated package are executed directly by Vitest. Hence, the previous custom support for the `--coverage` (`-c`) and `--source-map` (`-s`) flags is no longer needed and has been also removed. The `yarn run test` (or `npm run test`) script is still available in the generated package, but it executes Vitest. See [CLI flags](https://vitest.dev/guide/cli.html) supported in Vitest.

### Other changes

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Lock to the last compatible version of the `@ckeditor/ckeditor5-dev-build-tools` package due to the upcoming release of breaking changes in the `@ckeditor/ckeditor5-dev-*` packages. Closes [#191](https://github.com/ckeditor/ckeditor5-package-generator/issues/191). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/c5beffb74f5a481c3d51fed0db78fd64e6110728))
* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Replaced Karma with Vitest as the testing framework in the generated package. ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/7e7c6afd1aa80f30394b37475dea9129ed11dbfe))
* **[tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools)**: Removed support for the `--coverage` (`-c`) and `--source-map` (`-s`) flags. ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/7e7c6afd1aa80f30394b37475dea9129ed11dbfe))
* **[tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools)**: Removed `test` script from the tools, because unit tests in the generated package are executed now directly by Vitest. ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/7e7c6afd1aa80f30394b37475dea9129ed11dbfe))
* The generated package no longer integrates with the Transifex service. Thanks to that, a community can provide translation entries directly via pull requests. ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/c812fa0502f31e0534814dda06bbb05174e89a21))
* Converted the project repository to ESM. Closes [#192](https://github.com/ckeditor/ckeditor5-package-generator/issues/192). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/30f0ada815ba196e6069e04dc316ef567bbb0f3c))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Other releases:

* [@ckeditor/ckeditor5-package-tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools/v/3.0.0): v2.1.1 => v3.0.0
* [ckeditor5-package-generator](https://www.npmjs.com/package/ckeditor5-package-generator/v/3.0.0): v2.1.1 => v3.0.0
</details>


## [2.1.1](https://github.com/ckeditor/ckeditor5-package-generator/compare/v2.1.0...v2.1.1) (2024-09-30)

### Other changes

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Lock to the last compatible version of the `@ckeditor/ckeditor5-dev-build-tools` package due to the upcoming release of breaking changes in the `@ckeditor/ckeditor5-dev-*` packages. Closes [#191](https://github.com/ckeditor/ckeditor5-package-generator/issues/191). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/d031bb0321b4d66e9a97cf4b16475c40c773ad9f))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Other releases:

* [@ckeditor/ckeditor5-package-tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools/v/2.1.1): v2.1.0 => v2.1.1
* [ckeditor5-package-generator](https://www.npmjs.com/package/ckeditor5-package-generator/v/2.1.1): v2.1.0 => v2.1.1
</details>


## [3.0.0-alpha.0](https://github.com/ckeditor/ckeditor5-package-generator/compare/v2.1.0...v3.0.0-alpha.0) (2024-09-19)

### MINOR BREAKING CHANGES [ℹ️](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html#major-and-minor-breaking-changes)

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: The generated package no longer uses Karma as the test runner. Instead, Vitest is used.
* **[tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools)**: The `test` script is removed, because unit tests in the generated package are executed directly by Vitest. Hence, the previous custom support for the `--coverage` (`-c`) and `--source-map` (`-s`) flags is no longer needed and has been also removed. The `yarn run test` (or `npm run test`) script is still available in the generated package, but it executes Vitest. See [CLI flags](https://vitest.dev/guide/cli.html) supported in Vitest.

### Other changes

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Replaced Karma with Vitest as the testing framework in the generated package. ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/7e7c6afd1aa80f30394b37475dea9129ed11dbfe))
* **[tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools)**: Removed support for the `--coverage` (`-c`) and `--source-map` (`-s`) flags. ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/7e7c6afd1aa80f30394b37475dea9129ed11dbfe))
* **[tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools)**: Removed `test` script from the tools, because unit tests in the generated package are executed now directly by Vitest. ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/7e7c6afd1aa80f30394b37475dea9129ed11dbfe))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Other releases:

* [@ckeditor/ckeditor5-package-tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools/v/3.0.0-alpha.0): v2.1.0 => v3.0.0-alpha.0
* [ckeditor5-package-generator](https://www.npmjs.com/package/ckeditor5-package-generator/v/3.0.0-alpha.0): v2.1.0 => v3.0.0-alpha.0
</details>

---

To see all releases, visit the [release page](https://github.com/ckeditor/ckeditor5-package-generator/releases).

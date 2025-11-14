Changelog
=========

## [5.0.1](https://github.com/ckeditor/ckeditor5-package-generator/compare/v5.0.0...v5.0.1) (November 14, 2025)

### Bug fixes

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Add the `node:` prefix to built-in Node.js module imports.

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Other releases:

* [@ckeditor/ckeditor5-package-tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools/v/5.0.1): v5.0.0 => v5.0.1
* [ckeditor5-package-generator](https://www.npmjs.com/package/ckeditor5-package-generator/v/5.0.1): v5.0.0 => v5.0.1
</details>


## [5.0.0](https://github.com/ckeditor/ckeditor5-package-generator/compare/v4.1.1...v5.0.0) (November 13, 2025)

### MINOR BREAKING CHANGES [ℹ️](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html#major-and-minor-breaking-changes)

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator), [tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools)**: Updated the required version of Node.js to **v24.11**.

### Other changes

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Generated packages now output with testing suite using Vitest v4. Closes [#265](https://github.com/ckeditor/ckeditor5-package-generator/issues/265).

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Minor releases (contain minor breaking changes):

* [ckeditor5-package-generator](https://www.npmjs.com/package/ckeditor5-package-generator/v/5.0.0): v4.1.1 => v5.0.0
* [@ckeditor/ckeditor5-package-tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools/v/5.0.0): v4.1.1 => v5.0.0
</details>


## [4.1.1](https://github.com/ckeditor/ckeditor5-package-generator/compare/v4.1.0...v4.1.1) (October 14, 2025)

### Other changes

* **[tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools)**: Support for ESM module resolution in webpack configurations by including a new `loaderDefinitions.js()` rule to allow extension-less ESM imports. Closes [#260](https://github.com/ckeditor/ckeditor5-package-generator/issues/260).

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Other releases:

* [@ckeditor/ckeditor5-package-tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools/v/4.1.1): v4.1.0 => v4.1.1
* [ckeditor5-package-generator](https://www.npmjs.com/package/ckeditor5-package-generator/v/4.1.1): v4.1.0 => v4.1.1
</details>


## [4.1.0](https://github.com/ckeditor/ckeditor5-package-generator/compare/v4.0.2...v4.1.0) (September 16, 2025)

### Features

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Added comprehensive support for `pnpm` alongside existing `npm` and `yarn` options in the CKEditor 5 package generator. Closes [#247](https://github.com/ckeditor/ckeditor5-package-generator/issues/247).

  You can now use the `--use-pnpm` CLI flag to specify `pnpm` as your package manager when generating a new package.

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

---

To see all releases, visit the [release page](https://github.com/ckeditor/ckeditor5-package-generator/releases).

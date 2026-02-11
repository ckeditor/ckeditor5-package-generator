Changelog
=========

## [6.0.0-alpha.0](https://github.com/ckeditor/ckeditor5-package-generator/compare/v5.0.1...v6.0.0-alpha.0) (February 11, 2026)

This alpha release brings some significant changes to the package generator. We’ve removed support for the old installation methods and are now fully aligned with the new installation approach. As part of this shift, we took the opportunity to modernize the entire generated project setup.

New plugins are now created with a clean, pre-configured Vite setup instead of the previous webpack-based configuration. The result should feel more familiar to most developers, offer better performance, and be much easier to extend and customize as your plugin evolves.

### MAJOR BREAKING CHANGES [ℹ️](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html#major-and-minor-breaking-changes)

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Removed `--installation-methods` (`-m`) flag that was used to provide the CKEditor 5 installation method: either the current (modern) method or the legacy (DLL-based) one. Now, only the current installation method is supported, so no DLL-based files and configurations are generated anymore. For more details on migrating custom plugins, please refer to the [documentation](https://ckeditor.com/docs/ckeditor5/latest/updating/nim-migration/custom-plugins.html). See [#280](https://github.com/ckeditor/ckeditor5-package-generator/issues/280).
* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Bumped the minimal required `ckeditor5` peer dependency in the generated packages to at least v48.0.0. See [#280](https://github.com/ckeditor/ckeditor5-package-generator/issues/280).
* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Remove Support for Old Installation Methods. Closes [#270](https://github.com/ckeditor/ckeditor5-package-generator/issues/270).

  As previously announced, the end of March 2026 marks the end of support for Old Installation Methods (OIM), except for Long-Term Support (LTS) releases. This change is part of our ongoing efforts to modernize our tooling and improve the developer experience.

  As a result, the package generator no longer supports OIM-based projects. We encourage all projects to migrate to the new, modern installation methods.

  For more information, see the following discussion: https://github.com/ckeditor/ckeditor5/issues/17779
* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Packages created by the generator now use Vite (instead of webpack) to run the development server. Closes [#270](https://github.com/ckeditor/ckeditor5-package-generator/issues/270).
* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Upgrade TypeScript to `v5.5.4`. Closes [#270](https://github.com/ckeditor/ckeditor5-package-generator/issues/270).
* Delete the `ckeditor5-package-tools` package, as its functionality has been fully integrated into the `ckeditor5-package-generator` package. See [#295](https://github.com/ckeditor/ckeditor5-package-generator/issues/295).

### MINOR BREAKING CHANGES [ℹ️](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html#major-and-minor-breaking-changes)

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Removed `ts:build` and `ts:clear` scripts from the generated `package.json` file for TypeScript package. Also, the `tsconfig.release.json` file is not created anymore. See [#286](https://github.com/ckeditor/ckeditor5-package-generator/issues/286).

### Features

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Improved package name validation UX. The tool now prompts for a valid package name instead of exiting when an incorrect name is provided. Closes [#283](https://github.com/ckeditor/ckeditor5-package-generator/issues/283).
* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Added graceful handling for prompt cancellation (Ctrl+C). Closes [#283](https://github.com/ckeditor/ckeditor5-package-generator/issues/283).

### Other changes

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Removed `main`, `module` and `types` fields from the generated `package.json` file. See [#286](https://github.com/ckeditor/ckeditor5-package-generator/issues/286).
* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Move translations handling from `ckeditor5-package-tools` to `ckeditor5-package-generator` templates. See [#295](https://github.com/ckeditor/ckeditor5-package-generator/issues/295).

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Major releases (contain major breaking changes):

* [ckeditor5-package-generator](https://www.npmjs.com/package/ckeditor5-package-generator/v/6.0.0-alpha.0): v5.0.1 => v6.0.0-alpha.0
</details>


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

---

To see all releases, visit the [release page](https://github.com/ckeditor/ckeditor5-package-generator/releases).

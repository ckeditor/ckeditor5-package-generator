Changelog
=========

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


## [2.1.0](https://github.com/ckeditor/ckeditor5-package-generator/compare/v2.0.0...v2.1.0) (2024-08-07)

### MINOR BREAKING CHANGES [ℹ️](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html#major-and-minor-breaking-changes)

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: The global names for the `ckeditor5` and `ckeditor5-premium-features` packages in the UMD builds have been changed to `CKEDITOR` and `CKEDITOR_PREMIUM_FEATURES` respectively.

### Bug fixes

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: New flag `--global-name` to define a global name of the package to be used in the UMD build. See https://github.com/ckeditor/ckeditor5/issues/16798. ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/0bc5128710e4246ea72c1f06b02f0fbba5be9624))
* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Each package template should have own `README.md` based on what commands can be executed in it. Closes https://github.com/ckeditor/ckeditor5-package-generator/issues/174. ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/e7538509015e17c63332764e1d2fc6565509ff4b))
* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Updated the `exports` field in `package.json` templates to fix issues with loading CSS and translations in older bundlers. See https://github.com/ckeditor/ckeditor5/issues/16638. ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/b98672e4a4f2a65b7602f3ff8c305cb384c74647))
* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Changed the path to the types in the `package.json` in `ts` templates. See https://github.com/ckeditor/ckeditor5/issues/16684. ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/84ff608360e67f6d0184e7491682c3593d335045))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Other releases:

* [@ckeditor/ckeditor5-package-tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools/v/2.1.0): v2.0.0 => v2.1.0
* [ckeditor5-package-generator](https://www.npmjs.com/package/ckeditor5-package-generator/v/2.1.0): v2.0.0 => v2.1.0
</details>


## [2.0.0](https://github.com/ckeditor/ckeditor5-package-generator/compare/v2.0.0-alpha.0...v2.0.0) (2024-06-26)

We are excited to announce an update to the package generator for CKEditor 5 plugins. Now the new package generator fully supports the [latest installation methods](https://github.com/ckeditor/ckeditor5/releases/tag/v42.0.0) in CKEditor 5.

With this update, you will be prompted to choose whether you want to generate a plugin that supports only the current methods or both current and legacy methods. For more details on migrating custom plugins, please refer to the [documentation](https://ckeditor.com/docs/ckeditor5/latest/updating/nim-migration/custom-plugins.html).

### Features

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: New flag `--installation-methods` that should allow to generate package with current installation methods of CKEditor 5 or with current and legacy methods with DLLs. See https://github.com/ckeditor/ckeditor5/issues/15502, https://github.com/ckeditor/ckeditor5/issues/15739. ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/360afe0b2b77a3363b843dcd2574b1d89bc87c3b))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Releases containing new features:

* [@ckeditor/ckeditor5-package-tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools/v/2.0.0): v2.0.0-alpha.0 => v2.0.0
* [ckeditor5-package-generator](https://www.npmjs.com/package/ckeditor5-package-generator/v/2.0.0): v2.0.0-alpha.0 => v2.0.0
</details>


## [2.0.0-alpha.0](https://github.com/ckeditor/ckeditor5-package-generator/compare/v1.1.0...v2.0.0-alpha.0) (2024-05-28)

### MAJOR BREAKING CHANGES [ℹ️](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html#major-and-minor-breaking-changes)

* Upgraded the minimal versions of Node.js to `18.0.0` due to the end of LTS.

### MINOR BREAKING CHANGES [ℹ️](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html#major-and-minor-breaking-changes)

* **[tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools)**: The `typescript()` function exported from the `webpack-utils` module requires passing the `cwd` as the first argument. Optionally, you can pass the TypeScript configuration file name that should be used when processing TS files by `ts-loader`.

### Features

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Added the `--installation-methods` CLI flag that should allow the generation of a package without support for the [DLL builds](https://ckeditor.com/docs/ckeditor5/latest/installation/advanced/alternative-setups/dll-builds.html). See [#15502](https://github.com/ckeditor/ckeditor5/issues/15502), [#15739](https://github.com/ckeditor/ckeditor5/issues/15739).
* **[tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools)**: Karma will use the `tsconfig.test.json` file as a TypeScript configuration if it exists when executing automated tests. By default, it fallbacks to `tsconfig.json` file. ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/56207d846095a78e35bf2805c2c30823cb6cb9de))

### Bug fixes

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Allow to build plugin with potentially used external `ckeditor5-premium-features`. ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/9af9807f49db31685a2864c419eea77af176dbcc))

### Other changes

* **[generator](https://www.npmjs.com/package/ckeditor5-package-generator)**: Aligned the produced configuration to changes in CKEditor 5. See [ckeditor/ckeditor5#14173](https://github.com/ckeditor/ckeditor5/issues/14173). Closes [#160](https://github.com/ckeditor/ckeditor5-package-generator/issues/160). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/56207d846095a78e35bf2805c2c30823cb6cb9de))
* Updated the required version of Node.js to 18. See [ckeditor/ckeditor5#14924](https://github.com/ckeditor/ckeditor5/issues/14924). ([commit](https://github.com/ckeditor/ckeditor5-package-generator/commit/6842056128d279a9fb3dc1cadccbba3ccc1bf0df))

### Released packages

Check out the [Versioning policy](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/support/versioning-policy.html) guide for more information.

<details>
<summary>Released packages (summary)</summary>

Releases containing new features:

* [@ckeditor/ckeditor5-package-tools](https://www.npmjs.com/package/@ckeditor/ckeditor5-package-tools/v/2.0.0-alpha.0): v1.1.0 => v2.0.0-alpha.0
* [ckeditor5-package-generator](https://www.npmjs.com/package/ckeditor5-package-generator/v/2.0.0-alpha.0): v1.1.0 => v2.0.0-alpha.0
</details>


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

---

To see all releases, visit the [release page](https://github.com/ckeditor/ckeditor5-package-generator/releases).

# CKEditor 5 Package Tools

[![npm version](https://badge.fury.io/js/@ckeditor%2Fckeditor5-package-tools.svg)](https://badge.fury.io/js/@ckeditor%2Fckeditor5-package-tools)

This package implements the scripts and utils used by [`ckeditor5-package-generator`](https://www.npmjs.com/package/ckeditor5-package-generator).

## Installation

```bash
npm install --save @ckeditor/ckeditor5-package-tools
```

## Usage

The following scripts are available in the package:

* `test` &ndash; prepares an entry file and passes it to the [karma](https://karma-runner.github.io/) test runner,
* `start` &ndash; prepares the [development server](https://webpack.js.org/configuration/dev-server/) with the live-reloading mechanism,
* `dll:build` &ndash; prepares a file compatible with [CKEditor 5 DLL](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/development/dll-builds.html) that exposes plugins from the package,
* `translations:collect` &ndash; collects translations context and prepares them to be sent to [Transifex](https://www.transifex.com/),
* `translations:upload` &ndash; uploads collected contexts to [Transifex](https://www.transifex.com/),
* `translations:download` &ndash; downloads translated contexts from [Transifex](https://www.transifex.com/),
* `export-package-as-javascript` &ndash; changes `main` entry in `package.json` file to point to a `.js` file,
* `export-package-as-typescript` &ndash; changes `main` entry in `package.json` file to point to a `.ts` file.

There are two ways to integrate these scripts, either with [npm scripts](https://docs.npmjs.com/cli/v7/using-npm/scripts) or Node.js scripts.

### Integration with npm scripts

Available scripts can be called via npm scripts in `package.json` file, eg:

```json
{
  "dll:build": "ckeditor5-package-tools dll:build"
}
```

In case of `translations:download` and `translations:upload`, additional argument is required:

```json
{
  "translations:download": "ckeditor5-package-tools translations:download --transifex [API URL]"
}
```

### Integration with Node.js scripts

Available scripts can be called manually in node scripts, eg:

```js
const packageTools = require( '@ckeditor/ckeditor5-package-tools' );

packageTools[ 'dll:build' ]( /* Ckeditor5PackageToolsOptions */ );
```

All available scripts require the `Ckeditor5PackageToolsOptions` object. Its interface is described in the [`lib/utils/parse-arguments.js`](https://github.com/ckeditor/ckeditor5-package-generator/blob/master/packages/ckeditor5-package-tools/lib/utils/parse-arguments.js) file.

Additionally, `translations:download` and `translations:upload` tasks require the `transifex` option to be passed in the `Ckeditor5PackageToolsOptions` object.

## Contribute

The source code of this package is available on GitHub in https://github.com/ckeditor/ckeditor5-package-generator/tree/master/packages/ckeditor5-package-tools.

## Changelog

See the [`CHANGELOG.md`](https://github.com/ckeditor/ckeditor5-package-generator/blob/master/CHANGELOG.md) file.

## License

The package is licensed under the terms of [MIT license](https://opensource.org/licenses/MIT). Please check the [`LICENSE.md`](https://github.com/ckeditor/ckeditor5-package-generator/blob/master/packages/ckeditor5-package-tools/LICENSE.md) file.

# CKEditor 5 Package Tools

[![npm version](https://badge.fury.io/js/@ckeditor%2Fckeditor5-package-tools.svg)](https://badge.fury.io/js/@ckeditor%2Fckeditor5-package-tools)

This package implements the scripts and utils used by [`ckeditor5-package-generator`](https://www.npmjs.com/package/ckeditor5-package-generator).

## Installation

```bash
npm install --save @ckeditor/ckeditor5-package-tools
```

## Usage

The following scripts are available in the package:

* `test` &ndash; run tests using [Vitest](https://vitest.dev/) testing framework,
* `test:debug` &ndash; run tests using [Vitest](https://vitest.dev/) testing framework and allows debugging them. Once Vitest starts it will stop execution and wait for you to open developer tools that can connect to Node.js inspector,
* `start` &ndash; prepares the [development server](https://webpack.js.org/configuration/dev-server/) with the live-reloading mechanism,
* `translations:synchronize` &ndash; validates and synchronizes the translation messages by updating all translation files (`*.po` files) to be in sync with the context file,
* `translations:validate` &ndash; only validates the translation messages against the context file,
* `export-package-as-javascript` &ndash; changes `main` entry in `package.json` file to point to a `.js` file,
* `export-package-as-typescript` &ndash; changes `main` entry in `package.json` file to point to a `.ts` file.

There are two ways to integrate these scripts, either with [npm scripts](https://docs.npmjs.com/cli/v7/using-npm/scripts) or Node.js scripts.

### Integration with npm scripts

Available scripts can be called via npm scripts in the `package.json` file, e.g.:

```json
{
  "start": "ckeditor5-package-tools start"
}
```

### Integration with Node.js scripts

Available scripts can be called manually as Node scripts, e.g.:

```js
import packageTools from '@ckeditor/ckeditor5-package-tools';

packageTools[ 'translations:synchronize' ]( /* Ckeditor5PackageToolsOptions */ );
```

All available scripts require the `Ckeditor5PackageToolsOptions` object. Its interface is described in the [`lib/utils/parse-arguments.js`](https://github.com/ckeditor/ckeditor5-package-generator/blob/master/packages/ckeditor5-package-tools/lib/utils/parse-arguments.js) file.

## Contribute

The source code of this package is available on GitHub in https://github.com/ckeditor/ckeditor5-package-generator/tree/master/packages/ckeditor5-package-tools.

## Changelog

See the [`CHANGELOG.md`](https://github.com/ckeditor/ckeditor5-package-generator/blob/master/CHANGELOG.md) file.

## License

The package is licensed under the terms of [MIT license](https://opensource.org/licenses/MIT). Please check the [`LICENSE.md`](https://github.com/ckeditor/ckeditor5-package-generator/blob/master/packages/ckeditor5-package-tools/LICENSE.md) file.

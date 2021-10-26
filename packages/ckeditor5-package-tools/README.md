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
* `dll:build` &ndash; prepares a file compatible with [CKEditor 5 DLL](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/development/dll-builds.html) that exposes plugins from the package.

There are two ways to integrate these scripts, either with [npm scripts](https://docs.npmjs.com/cli/v7/using-npm/scripts) or Node.js scripts.

### Integration with npm scripts

Add the following tasks in `package.json`, in the `#scripts` section:

```json
{
  "dll:build": "ckeditor5-package-tools dll:build",
  "start": "ckeditor5-package-tools start",
  "test": "ckeditor5-package-tools test",
}
```

### Integration with Node.js scripts

The "test" task.

```js
'use strict';

const packageTools = require( '@ckeditor/ckeditor5-package-tools' );

packageTools.test( /* Ckeditor5PackageToolsOptions */ );
```

The "start" task:

```js
'use strict';

const packageTools = require( '@ckeditor/ckeditor5-package-tools' );

packageTools.start( /* Ckeditor5PackageToolsOptions */ );
```

The "dll:build" task:

```js
'use strict';

const packageTools = require( '@ckeditor/ckeditor5-package-tools' );

packageTools[ 'dll:build' ]( /* Ckeditor5PackageToolsOptions */ );
```

The `Ckeditor5PackageToolsOptions` object interface is described in the [`lib/utils/parse-arguments.js`](https://github.com/ckeditor/ckeditor5-package-generator/blob/master/packages/ckeditor5-package-tools/lib/utils/parse-arguments.js) file.

## Contribute

The source code of this package is available on GitHub in https://github.com/ckeditor/ckeditor5-package-generator/tree/master/packages/ckeditor5-package-tools.

## Changelog

See the [`CHANGELOG.md`](https://github.com/ckeditor/ckeditor5-package-generator/blob/master/CHANGELOG.md) file.

## License

The package is licensed under the terms of [MIT license](https://opensource.org/licenses/MIT). Please check the [`LICENSE.md`](https://github.com/ckeditor/ckeditor5-package-generator/blob/master/packages/ckeditor5-package-tools/LICENSE.md) file.

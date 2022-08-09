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

Add the following tasks in `package.json`, in the `#scripts` section:

```json
{
  "dll:build": "ckeditor5-package-tools dll:build",
  "start": "ckeditor5-package-tools start",
  "test": "ckeditor5-package-tools test",
  "translations:collect": "ckeditor5-package-tools translations:collect",
  "translations:download": "ckeditor5-package-tools translations:download --transifex [API URL]",
  "translations:upload": "ckeditor5-package-tools translations:upload --transifex [API URL]"
}
```

Additionally, for TypeScript packages, following automatic tasks for releasing the package can be used:

```json
{
  "prepublishOnly": "ckeditor5-package-tools export-package-as-javascript",
  "postpublish": "ckeditor5-package-tools export-package-as-typescript"
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

The "translations:collect" task:

```js
'use strict';

const packageTools = require( '@ckeditor/ckeditor5-package-tools' );

packageTools[ 'translations:collect' ]( /* Ckeditor5PackageToolsOptions */ );
```

The "translations:download" task:

```js
'use strict';

const packageTools = require( '@ckeditor/ckeditor5-package-tools' );

packageTools[ 'translations:download' ]( /* Ckeditor5PackageToolsOptions */ );
```

This task requires the `transifex` option to be passed in the `Ckeditor5PackageToolsOptions` object.

The "translations:upload" task:

```js
'use strict';

const packageTools = require( '@ckeditor/ckeditor5-package-tools' );

packageTools[ 'translations:upload' ]( /* Ckeditor5PackageToolsOptions */ );
```

This task requires the `transifex` option to be passed in the `Ckeditor5PackageToolsOptions` object.

The `Ckeditor5PackageToolsOptions` object interface is described in the [`lib/utils/parse-arguments.js`](https://github.com/ckeditor/ckeditor5-package-generator/blob/master/packages/ckeditor5-package-tools/lib/utils/parse-arguments.js) file.

The "export-package-as-javascript" task:

```js
'use strict';

const packageTools = require( '@ckeditor/ckeditor5-package-tools' );

packageTools[ 'export-package-as-javascript' ]( /* Ckeditor5PackageToolsOptions */ );
```

The "export-package-as-typescript" task:

```js
'use strict';

const packageTools = require( '@ckeditor/ckeditor5-package-tools' );

packageTools[ 'export-package-as-typescript' ]( /* Ckeditor5PackageToolsOptions */ );
```

## Contribute

The source code of this package is available on GitHub in https://github.com/ckeditor/ckeditor5-package-generator/tree/master/packages/ckeditor5-package-tools.

## Changelog

See the [`CHANGELOG.md`](https://github.com/ckeditor/ckeditor5-package-generator/blob/master/CHANGELOG.md) file.

## License

The package is licensed under the terms of [MIT license](https://opensource.org/licenses/MIT). Please check the [`LICENSE.md`](https://github.com/ckeditor/ckeditor5-package-generator/blob/master/packages/ckeditor5-package-tools/LICENSE.md) file.

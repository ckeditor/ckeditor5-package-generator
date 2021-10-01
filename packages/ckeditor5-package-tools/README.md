CKEditor 5 Package Tools
========================

[![npm version](https://badge.fury.io/js/@ckeditor%2Fckeditor5-package-tools.svg)](https://badge.fury.io/js/@ckeditor%2Fckeditor5-package-tools)

This repository contains the scripts and functions used by the [`ckeditor5-package-generator`](https://www.npmjs.com/package/ckeditor5-package-generator) tool.

The following scripts are available:

* `test` &ndash; prepares an entry file and passes it to [karma](https://karma-runner.github.io/) test runner,
* `start` &ndash; prepares [development server](https://webpack.js.org/configuration/dev-server/) with the live-reloading mechanism,
* `dll:build` &ndash; prepares a compatible with [CKEditor 5 DLL](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/development/dll-builds.html) file that exposes plugins from the package.

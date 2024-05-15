#!/usr/bin/env node

/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* eslint-env node */

'use strict';

const EXPECTED_DIST_PUBLISH_FILES = [
	'dist/browser/index-content.css',
	'dist/browser/index-editor.css',
	'dist/browser/index.css',
	'dist/browser/index.js',
	'dist/browser/index.js.map',
	'dist/browser/index.umd.js',
	'dist/browser/index.umd.js.map',

	'dist/index-content.css',
	'dist/index-editor.css',
	'dist/index.css',
	'dist/index.js',
	'dist/index.js.map'
];

const EXPECTED_JS_PUBLISH_FILES = [
	...EXPECTED_DIST_PUBLISH_FILES,
	'src/index.js',
	'src/testpackage.js',

	'lang/contexts.json',
	'theme/icons/ckeditor.svg',

	'package.json',
	'LICENSE.md',
	'README.md',
	'ckeditor5-metadata.json'
];

const EXPECTED_TS_PUBLISH_FILES = [
	...EXPECTED_DIST_PUBLISH_FILES,
	'package.json',
	'LICENSE.md',
	'README.md',
	'ckeditor5-metadata.json'
];

const EXPECTED_TS_LEGACY_PUBLISH_FILES = [
	'src/augmentation.js',
	'src/index.js',
	'src/testpackage.js',
	'src/augmentation.d.ts',
	'src/index.d.ts',
	'src/testpackage.d.ts',

	'lang/contexts.json',
	'theme/icons/ckeditor.svg'
];

const EXPECTED_DIST_TYPES_PUBLISH_FILES = [
	'dist/types/augmentation.d.ts',
	'dist/types/index.d.ts'
];

const EXPECTED_PUBLISH_FILES = {
	js: [
		...EXPECTED_JS_PUBLISH_FILES
	],
	ts: [
		...EXPECTED_TS_PUBLISH_FILES,
		...EXPECTED_DIST_TYPES_PUBLISH_FILES
	]
};

const EXPECTED_LEGACY_PUBLISH_FILES = {
	js: [
		...EXPECTED_JS_PUBLISH_FILES,
		'build/test-package.js'
	],
	ts: [
		...EXPECTED_TS_PUBLISH_FILES,
		...EXPECTED_TS_LEGACY_PUBLISH_FILES,
		...EXPECTED_DIST_TYPES_PUBLISH_FILES,
		'build/test-package.js'
	]
};

const EXPECTED_SRC_DIR_FILES = {
	js: [
		'index.js',
		'testpackage.js'
	],
	ts: [
		'augmentation.ts',
		'index.ts',
		'testpackage.ts'
	]
};

module.exports = {
	EXPECTED_PUBLISH_FILES,
	EXPECTED_LEGACY_PUBLISH_FILES,
	EXPECTED_SRC_DIR_FILES
};

#!/usr/bin/env node

/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

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

const EXPECTED_DIST_TYPES_PUBLISH_FILES = [
	'dist/augmentation.d.ts',
	'dist/index.d.ts'
];

export const EXPECTED_PUBLISH_FILES = {
	js: [
		...EXPECTED_JS_PUBLISH_FILES
	],
	ts: [
		...EXPECTED_TS_PUBLISH_FILES,
		...EXPECTED_DIST_TYPES_PUBLISH_FILES
	]
};

export const EXPECTED_SRC_DIR_FILES = {
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

#!/usr/bin/env node

/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

const EXPECTED_DIST_PUBLISH_FILES = [
	'dist/browser/index.css',
	'dist/browser/index.es.js',
	'dist/browser/index.umd.js',
	'dist/index.css',
	'dist/index.js'
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

#!/usr/bin/env node

/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* eslint-env node */

'use strict';

const { runCrawler } = require( '@ckeditor/ckeditor5-dev-web-crawler' );

// The crawler uses `process.exit()` to finish its work, so it needs to be executed in
// a separated process to avoid canceling a build if the verification is in the middle of tasks
// to verification.
//
// The ``process.argv` array structure:
//
// [0] = 'node'
// [1] = './verify-sample.js'
// [2] = 'http://localhost:8080/'

runCrawler( {
	url: process.argv[ 2 ],
	depth: 1,
	concurrency: 1,
	quit: false,
	noSpinner: true
} );

#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* eslint-env node */

'use strict';

const crawler = require( '@ckeditor/ckeditor5-dev-docs/lib/web-crawler/index.js' );

const SAMPLE_ADDRESS = 'http://localhost:8080/';

const CRAWLER_OPTIONS = {
	url: SAMPLE_ADDRESS
};

console.log( 'Crawler Test' );

crawler( CRAWLER_OPTIONS );

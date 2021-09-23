#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* eslint-env node */

'use strict';

const childProcess = require( 'child_process' );
const crawler = require( '@ckeditor/ckeditor5-dev-docs/lib/web-crawler/index.js' );

const commands = [
	'node packages/create-ckeditor5-plugin @xyz/ckeditor5-test-package --dev',
	'mv ckeditor5-test-package ..',
	'cd ../ckeditor5-test-package',
	'yarn run test',
	'yarn run lint',
	'yarn run start'
].join( ' && ' );

let sampleUrl;

const process = childProcess.spawn( commands, {
	shell: true
} );
process.stderr.on( 'data', data => {
	const content = data.toString().slice( 0, -1 );
	const urlMatch = content.match( /http:\/\/localhost:\d+\// );

	console.log( content );

	if ( urlMatch && !sampleUrl ) {
		sampleUrl = urlMatch[ 0 ];
	}
} );
process.stdout.on( 'data', data => {
	const content = data.toString().slice( 0, -1 );
	const endMatch = /\+ \d+ hidden modules/.test( content );

	console.log( content );

	if ( endMatch ) {
		console.log( '\nServer ready, launching the crawler...\n' );
		crawler( { url: sampleUrl } );
	}
} );
process.on( 'exit', exitCode => {
	console.log( 'Child process exited with code: ' + exitCode );
} );

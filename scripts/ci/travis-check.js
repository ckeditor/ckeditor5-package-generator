#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* eslint-env node */

'use strict';

const path = require( 'path' );
const { spawn, spawnSync } = require( 'child_process' );
const crawler = require( '@ckeditor/ckeditor5-dev-docs/lib/web-crawler/index.js' );

console.log( path.join( __dirname, '..', '..' ) );
console.log( path.join( __dirname, '..', '..', '..', 'ckeditor5-test-package' ) );

const spawnOptions = {
	encoding: 'utf8',
	cwd: path.join( __dirname, '..', '..' ),
	stdio: [ 'inherit', 'inherit', 'inherit', 'inherit', 'inherit' ]
};

spawnSync( 'node', [ 'packages/create-ckeditor5-plugin', '@xyz/ckeditor5-test-package', '--dev' ], spawnOptions );
spawnSync( 'mv', [ 'ckeditor5-test-package', '..' ], spawnOptions );
spawnOptions.cwd = path.join( __dirname, '..', '..', '..', 'ckeditor5-test-package' );
spawnSync( 'yarn', [ 'run', 'test' ], spawnOptions );
spawnSync( 'yarn', [ 'run', 'lint' ], spawnOptions );

const sampleServer = spawn( 'yarn', [ 'run', 'start' ], {
	shell: true,
	cwd: path.join( __dirname, '..', '..', '..', 'ckeditor5-test-package' )
} );
let sampleUrl;

sampleServer.stderr.on( 'data', data => {
	const content = data.toString().slice( 0, -1 );
	const urlMatch = content.match( /http:\/\/localhost:\d+\// );

	console.log( content );

	if ( !sampleUrl && urlMatch ) {
		sampleUrl = urlMatch[ 0 ];
	}
} );

sampleServer.stdout.on( 'data', data => {
	const content = data.toString().slice( 0, -1 );
	const endMatch = /\+ \d+ hidden modules/.test( content );

	console.log( content );

	if ( endMatch ) {
		console.log( '\nServer ready, launching the crawler...\n' );
		crawler( { url: sampleUrl } );
	}
} );

sampleServer.on( 'exit', exitCode => {
	console.log( 'Child process exited with code: ' + exitCode );
} );

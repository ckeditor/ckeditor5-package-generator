#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* eslint-env node */

'use strict';

const http = require( 'http' );
const { spawn } = require( 'child_process' );
const crawler = require( '@ckeditor/ckeditor5-dev-docs/lib/web-crawler/index.js' );

const SAMPLE_ADDRESS = 'http://localhost:8080/';
const CRAWLER_OPTIONS = {
	url: SAMPLE_ADDRESS
};
const commands = [
	'cd ckeditor5-test-package',
	'yarn run start'
].join( ' && ' );

const process = spawn( commands, {
	shell: true
} );
process.stderr.on( 'data', data => {
	console.error( data.toString() );
} );
process.stdout.on( 'data', data => {
	console.log( data.toString() );
} );
process.on( 'exit', exitCode => {
	console.log( 'Child process exited with code: ' + exitCode );
} );

let i = 0;

const timer = setInterval( () => {
	checkUrlAvailability( SAMPLE_ADDRESS )
		.then( value => {
			if ( value ) {
				clearInterval( timer );
				console.log( 'Success! Starting the crawler...' );
				crawler( CRAWLER_OPTIONS );
			} else {
				console.log( 'Crawler waiting...' );
			}
		} )
		.catch( err => {
			console.error( err.message );
		} );
	i++;
	if ( i >= 10 ) {
		clearInterval( timer );
		console.error( `Failed to attach the crawler, ${ SAMPLE_ADDRESS } is not available!` );
	}
}, 2500 );

function checkUrlAvailability( url ) {
	return new Promise( resolve => {
		http.get( url, response => {
			if ( response.statusCode === 200 ) {
				resolve( true );
			} else {
				resolve( false );
			}
		} ).on( 'error', () => {
			resolve( false );
		} );
	} );
}

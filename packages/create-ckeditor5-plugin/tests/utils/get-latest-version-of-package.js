/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const sinon = require( 'sinon' );
const expect = require( 'chai' ).expect;

describe( 'lib/utils/get-latest-version-of-package', () => {
	let getLatestVersionOfPackage;

	beforeEach( () => {
		getLatestVersionOfPackage = require( '../../lib/utils/get-latest-version-of-package' );
	} );

	afterEach( () => {
		sinon.restore();
	} );

	it( 'should be a function', () => {
		expect( getLatestVersionOfPackage ).to.be.an( 'function' );
	} );

	it( 'returns a string', async () => {
		const returnedValue = await getLatestVersionOfPackage( 'ckeditor5' );

		expect( returnedValue ).to.be.a( 'string' );
	} );

	it( 'returns a valid SemVer number', async () => {
		const returnedValue = await getLatestVersionOfPackage( 'ckeditor5' );

		expect( returnedValue ).to.match( /^\d+\.\d+\.\d+$/ );
	} );
} );

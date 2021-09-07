/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const sinon = require( 'sinon' );
const expect = require( 'chai' ).expect;
const mockery = require( 'mockery' );
const path = require( 'path' );

describe( 'lib/utils/getPackageVersions()', () => {
	let getCKEditor5PackagesVersions, getLatestVersionOfPackage;

	beforeEach( () => {
		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

		getLatestVersionOfPackage = sinon.stub();

		mockery.registerMock( './getLatestVersionOfPackage', getLatestVersionOfPackage );
		getLatestVersionOfPackage.returns( '30.0.0' );

		getCKEditor5PackagesVersions = require( '../../lib/utils/getCKEditor5PackagesVersions' );
	} );

	afterEach( () => {
		sinon.restore();
		mockery.disable();
	} );

	it( 'should be a function', () => {
		expect( getCKEditor5PackagesVersions ).to.be.an( 'function' );
	} );

	it( 'should behave correctly with the devMode set to true', () => {
		const returnedValue = getCKEditor5PackagesVersions( true );

		const PROJECT_ROOT_DIRECTORY = path.join( __dirname, '..', '..', '..' );
		let packageTools = 'file:' + path.resolve( PROJECT_ROOT_DIRECTORY, 'ckeditor5-package-tools' );
		packageTools = packageTools.split( path.sep ).join( path.posix.sep );

		expect( returnedValue ).to.eql( {
			ckeditor5: '30.0.0',
			devUtils: '30.0.0',
			packageTools
		} );
	} );

	it( 'should behave correctly with the devMode set to false', () => {
		const returnedValue = getCKEditor5PackagesVersions( false );
		expect( returnedValue ).to.eql( {
			ckeditor5: '30.0.0',
			devUtils: '30.0.0',
			packageTools: '^30.0.0'
		} );
	} );
} );

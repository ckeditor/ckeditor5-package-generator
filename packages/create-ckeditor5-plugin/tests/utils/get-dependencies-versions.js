/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const sinon = require( 'sinon' );
const expect = require( 'chai' ).expect;
const mockery = require( 'mockery' );
const path = require( 'path' );

describe( 'lib/utils/get-dependencies-versions', () => {
	let getDependenciesVersions, getPackageVersion;

	beforeEach( () => {
		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

		getPackageVersion = sinon.stub();

		mockery.registerMock( './get-package-version', getPackageVersion );
		getPackageVersion.withArgs( 'ckeditor5' ).returns( '30.0.0' );
		getPackageVersion.withArgs( '@ckeditor/ckeditor5-dev-utils' ).returns( '25.0.0' );
		getPackageVersion.withArgs( '@ckeditor/ckeditor5-package-tools' ).returns( '1.0.0' );

		getDependenciesVersions = require( '../../lib/utils/get-dependencies-versions' );
	} );

	afterEach( () => {
		sinon.restore();
		mockery.disable();
	} );

	it( 'should be a function', () => {
		expect( getDependenciesVersions ).to.be.an( 'function' );
	} );

	it( 'returns an object with a version of the "ckeditor5" package', () => {
		const returnedValue = getDependenciesVersions( false );
		expect( returnedValue.ckeditor5 ).to.equal( '30.0.0' );
	} );

	it( 'returns an object with a version of the "@ckeditor/ckeditor5-dev-utils" package', () => {
		const returnedValue = getDependenciesVersions( false );
		expect( returnedValue.devUtils ).to.equal( '25.0.0' );
	} );

	it( 'returns an object with a version of the "@ckeditor/ckeditor5-package-tools" package if "devMode" is disabled', () => {
		const returnedValue = getDependenciesVersions( false );
		expect( returnedValue.packageTools ).to.equal( '^1.0.0' );
	} );

	it( 'it returns an absolute path to the "@ckeditor/ckeditor5-package-tools" package if "devMode" is enabled', () => {
		const returnedValue = getDependenciesVersions( true );

		const PROJECT_ROOT_DIRECTORY = path.join( __dirname, '..', '..', '..' );
		let packageTools = 'file:' + path.resolve( PROJECT_ROOT_DIRECTORY, 'ckeditor5-package-tools' );
		packageTools = packageTools.split( path.sep ).join( path.posix.sep );

		expect( returnedValue.packageTools ).to.equal( packageTools );
	} );
} );
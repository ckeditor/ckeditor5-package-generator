/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const sinon = require( 'sinon' );
const expect = require( 'chai' ).expect;
const mockery = require( 'mockery' );

describe( 'lib/utils/get-latest-version-of-package', () => {
	let getLatestVersionOfPackage, execSyncStub;

	beforeEach( () => {
		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

		execSyncStub = sinon.stub().returns( Buffer.from( '30.0.0' ) );

		mockery.registerMock( 'child_process', {
			execSync: execSyncStub
		} );

		getLatestVersionOfPackage = require( '../../lib/utils/get-latest-version-of-package' );
	} );

	afterEach( () => {
		mockery.disable();
		sinon.restore();
	} );

	it( 'should be a function', () => {
		expect( getLatestVersionOfPackage ).to.be.an( 'function' );
	} );

	it( 'returns a string', () => {
		const returnedValue = getLatestVersionOfPackage( 'ckeditor5' );

		expect( returnedValue ).to.be.a( 'string' );
	} );

	it( 'calls "npm show" to deterine the version', () => {
		getLatestVersionOfPackage( 'ckeditor5' );

		expect( execSyncStub.firstCall.firstArg ).to.equal( 'npm view ckeditor5 version' );
	} );

	it( 'returns a version matching semantic versioning specification', () => {
		const returnedValue = getLatestVersionOfPackage( 'ckeditor5' );

		expect( returnedValue ).to.match( /^\d+\.\d+\.\d+$/ );
	} );
} );

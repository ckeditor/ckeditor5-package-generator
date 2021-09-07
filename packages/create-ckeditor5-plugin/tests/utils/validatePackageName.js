/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const sinon = require( 'sinon' );
const expect = require( 'chai' ).expect;
const mockery = require( 'mockery' );

describe( 'lib/utils-ccp/validatePackageName()', () => {
	let validatePackageName, validateNpmPackageName;

	beforeEach( () => {
		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

		validateNpmPackageName = sinon.stub();

		mockery.registerMock( 'validate-npm-package-name', validateNpmPackageName );

		sinon.stub( console, 'info' );

		validatePackageName = require( '../../lib/utils/validatePackageName' );
	} );

	afterEach( () => {
		sinon.restore();
		mockery.disable();
	} );

	it( 'should be a function', () => {
		expect( validatePackageName ).to.be.an( 'function' );
	} );

	it( 'returns true for a valid package name', () => {
		validateNpmPackageName.returns( { validForNewPackages: true } );

		const returnedValue = validatePackageName( 'ckeditor5-test-package' );

		expect( returnedValue ).to.equal( true );
	} );

	it( 'returns false for a package name that is not valid name for a npm package', () => {
		validateNpmPackageName.returns( { validForNewPackages: false } );
		const consoleStub = sinon.stub( console, 'log' );

		const returnedValue = validatePackageName( 'ckeditor5-test-package' );

		consoleStub.restore();

		expect( returnedValue ).to.equal( false );
		expect( consoleStub.callCount ).to.equal( 1 );
		expect( consoleStub.firstCall.args[ 0 ] ).to.equal(
			'Provided <packageName> is not valid name for a npm package.'
		);
	} );

	it( 'returns false for a package name that does not contain the "ckeditor5-" prefix', () => {
		validateNpmPackageName.returns( { validForNewPackages: true } );
		const consoleStub = sinon.stub( console, 'log' );

		const returnedValue = validatePackageName( 'test-package' );

		consoleStub.restore();

		expect( returnedValue ).to.equal( false );
		expect( consoleStub.callCount ).to.equal( 1 );
		expect( consoleStub.firstCall.args[ 0 ] ).to.equal(
			'Package name should follow the "ckeditor5-" prefix.'
		);
	} );

	it( 'returns false for a package name that contains only the "ckeditor5-" prefix', () => {
		validateNpmPackageName.returns( { validForNewPackages: true } );
		const consoleStub = sinon.stub( console, 'log' );

		const returnedValue = validatePackageName( 'ckeditor5-' );

		consoleStub.restore();

		expect( returnedValue ).to.equal( false );
		expect( consoleStub.callCount ).to.equal( 1 );
		expect( consoleStub.firstCall.args[ 0 ] ).to.equal(
			'Package name should contain its name after the "ckeditor5-" prefix.'
		);
	} );
} );

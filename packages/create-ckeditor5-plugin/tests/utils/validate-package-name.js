/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

const sinon = require( 'sinon' );
const expect = require( 'chai' ).expect;
const mockery = require( 'mockery' );

describe( 'lib/utils/validate-package-name', () => {
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

		validatePackageName = require( '../../lib/utils/validate-package-name' );
	} );

	afterEach( () => {
		sinon.restore();
		mockery.disable();
	} );

	it( 'should be a function', () => {
		expect( validatePackageName ).to.be.an( 'function' );
	} );

	it( 'returns an empty array for a valid package name', () => {
		validateNpmPackageName.returns( { validForNewPackages: true } );

		const returnedValue = validatePackageName( '@scope/ckeditor5-test-package' );

		expect( returnedValue ).to.eql( [] );
	} );

	describe( 'returns an array with error messages for a package name', () => {
		// See: https://www.npmjs.com/package/validate-npm-package-name#naming-rules.
		it( 'if a package name does not match to npm rules', () => {
			validateNpmPackageName.returns( { validForNewPackages: false, errors: [ 'Example error' ] } );

			const returnedValue = validatePackageName( '@scope/ckeditor5-test-package' );

			expect( returnedValue ).to.eql( [
				'Provided <packageName> is not valid name for a npm package:',
				'  * Example error'
			] );
		} );

		// See https://www.npmjs.com/package/validate-npm-package-name#legacy-names.
		it( 'if a package name does not match to legacy npm rules', () => {
			validateNpmPackageName.returns( { validForNewPackages: false, warnings: [ 'Example warning' ] } );

			const returnedValue = validatePackageName( '@scope/ckeditor5-test-package' );

			expect( returnedValue ).to.eql( [
				'Provided <packageName> is not valid name for a npm package:',
				'  * Example warning'
			] );
		} );

		it( 'does not contain "@scope"', () => {
			validateNpmPackageName.returns( { validForNewPackages: true } );

			const returnedValue = validatePackageName( '/ckeditor5-test-package' );

			expect( returnedValue ).to.eql( [
				'Provided <packageName> should start with the "@scope".'
			] );
		} );

		it( 'does not contain the "ckeditor5-" prefix', () => {
			validateNpmPackageName.returns( { validForNewPackages: true } );

			const returnedValue = validatePackageName( '@scope/test-package' );

			expect( returnedValue ).to.eql( [
				'Package name should contain the "ckeditor5-" prefix followed by the package name.'
			] );
		} );

		it( 'does not follow the "ckeditor5-" prefix with a package name', () => {
			validateNpmPackageName.returns( { validForNewPackages: true } );

			const returnedValue = validatePackageName( '@scope/ckeditor5-' );

			expect( returnedValue ).to.eql( [
				'Package name should contain the "ckeditor5-" prefix followed by the package name.'
			] );
		} );
	} );
} );

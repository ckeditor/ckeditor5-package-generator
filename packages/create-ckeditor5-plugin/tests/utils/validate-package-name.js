/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const sinon = require( 'sinon' );
const expect = require( 'chai' ).expect;

describe( 'lib/utils/validate-package-name', () => {
	let validatePackageName;

	beforeEach( () => {
		validatePackageName = require( '../../lib/utils/validate-package-name' );
	} );

	afterEach( () => {
		sinon.restore();
	} );

	it( 'should be a function', () => {
		expect( validatePackageName ).to.be.an( 'function' );
	} );

	it( 'returns null for a valid package name', () => {
		const returnedValue = validatePackageName( '@scope/ckeditor5-test-package' );

		expect( returnedValue ).to.equal( null );
	} );

	it( 'returns correct string for a name longer than 214 characters', () => {
		const packageName = '@scope/ckeditor5-f' + 'o'.repeat( 214 );
		const returnedValue = validatePackageName( packageName );

		expect( returnedValue ).to.equal( 'Name can not be longer than 214 characters.' );
	} );

	it( 'returns correct string for a name containing capital characters', () => {
		const returnedValue = validatePackageName( '@scope/ckeditor5-TEST-package' );

		expect( returnedValue ).to.equal( 'Capital letters are not allowed.' );
	} );

	describe( 'returns correct string for a scope containing invalid characters', () => {
		it( 'escaped by encodeURIComponent', () => {
			const returnedValue = validatePackageName( '@sco¶e/ckeditor5-test-package' );

			expect( returnedValue ).to.equal( 'Scope contains invalid characters.' );
		} );
		it( 'not escaped by encodeURIComponent', () => {
			const returnedValue = validatePackageName( '@sc*pe/ckeditor5-test-package' );

			expect( returnedValue ).to.equal( 'Scope contains invalid characters.' );
		} );
	} );

	describe( 'returns correct string for a name containing invalid characters', () => {
		it( 'escaped by encodeURIComponent', () => {
			const returnedValue = validatePackageName( '@scope/ckeditor5-test-paçkage' );

			expect( returnedValue ).to.equal( 'Name contains invalid characters.' );
		} );

		it( 'not escaped by encodeURIComponent', () => {
			const returnedValue = validatePackageName( '@scope/ckeditor5-test(package)' );

			expect( returnedValue ).to.equal( 'Name contains invalid characters.' );
		} );
	} );

	describe( 'returns correct string for a name not following correct pattern', () => {
		it( 'missing "@scope"', () => {
			const returnedValue = validatePackageName( 'ckeditor5-test-package' );

			expect( returnedValue ).to.equal( 'Name has to follow the correct pattern.' );
		} );

		it( 'missing "/"', () => {
			const returnedValue = validatePackageName( '@scopeckeditor5-test-package' );

			expect( returnedValue ).to.equal( 'Name has to follow the correct pattern.' );
		} );

		it( 'missing "ckeditor5-"', () => {
			const returnedValue = validatePackageName( '@scope/test-package' );

			expect( returnedValue ).to.equal( 'Name has to follow the correct pattern.' );
		} );

		it( 'missing package name', () => {
			const returnedValue = validatePackageName( '@scope/ckeditor5-' );

			expect( returnedValue ).to.equal( 'Name has to follow the correct pattern.' );
		} );
	} );
} );

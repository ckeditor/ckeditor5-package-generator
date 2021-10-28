/**
 * @license Copyright (c) 2020-2021, CKSource - Frederico Knabben. All rights reserved.
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

	describe( 'verifying package name length', () => {
		it( 'rejects an empty package name', () => {
			const error = validatePackageName( '' );

			expect( error ).to.equal( 'The package name cannot be an empty string - pass the name as the first argument to the script.' );
		} );

		it( 'accepts a name lesser than 214 characters', () => {
			const error = validatePackageName( '@ckeditor/ckeditor5-foo' );

			expect( error ).to.not.equal( 'The length of the package name cannot be longer than 214 characters.' );
		} );

		it( 'accepts the length of a name equal to 214', () => {
			// 214 is a limit, 21 is the length of the string, the rest is "o".
			const error = validatePackageName( '@ckeditor/ckeditor5-f' + 'o'.repeat( 193 ) );

			expect( error ).to.not.equal( 'The length of the package name cannot be longer than 214 characters.' );
		} );

		it( 'rejects a name longer than 214 characters', () => {
			// 214 is a limit, 21 is the length of the string, the rest is "o". Add 1 to exceed the limit.
			const error = validatePackageName( '@ckeditor/ckeditor5-f' + 'o'.repeat( 194 ) );

			expect( error ).to.equal( 'The length of the package name cannot be longer than 214 characters.' );
		} );
	} );

	describe( 'verifying capital letters', () => {
		it( 'rejects a package name if it contains at least a single capital letter', () => {
			const error = validatePackageName( '@ckeditor/ckeditor5-Foo' );

			expect( error ).to.equal( 'The package name cannot contain capital letters.' );
		} );
	} );

	describe( 'verifying compliance with the pattern', () => {
		it( 'rejects the package name without a scope', () => {
			const error = validatePackageName( 'ckeditor5-foo' );

			expect( error ).to.equal( 'The package name must match the "@[scope]/ckeditor5-[feature-name]" pattern.' );
		} );

		it( 'rejects the package name if the scope misses the "at" (@) character at the beginning', () => {
			const error = validatePackageName( 'ckeditor/ckeditor5-foo' );

			expect( error ).to.equal( 'The package name must match the "@[scope]/ckeditor5-[feature-name]" pattern.' );
		} );

		it( 'rejects the package name if the name ends with the slash (/)', () => {
			const error = validatePackageName( '@ckeditor/ckeditor5-foo/' );

			expect( error ).to.equal( 'The package name must match the "@[scope]/ckeditor5-[feature-name]" pattern.' );
		} );

		it( 'rejects the package name if it does not match to the ckeditor5-* pattern (missing "ckeditor5-" prefix)', () => {
			const error = validatePackageName( '@ckeditor/foo' );

			expect( error ).to.equal( 'The package name must match the "@[scope]/ckeditor5-[feature-name]" pattern.' );
		} );

		it( 'rejects the package name if it does not match to the ckeditor5-* pattern (missing hyphen-minus)', () => {
			const error = validatePackageName( '@ckeditor/ckeditor5_foo' );

			expect( error ).to.equal( 'The package name must match the "@[scope]/ckeditor5-[feature-name]" pattern.' );
		} );
	} );

	describe( 'verifying allowed characters', () => {
		it( 'rejects if the package name contains non-friendly URL characters - check ~', () => {
			const error = validatePackageName( '@ckeditor/ckeditor5-foo~foo' );

			expect( error ).to.equal( 'The package name contains non-allowed characters.' );
		} );

		it( 'rejects if the package name contains non-friendly URL characters - check \'', () => {
			const error = validatePackageName( '@ckeditor/ckeditor5-foo\'foo' );

			expect( error ).to.equal( 'The package name contains non-allowed characters.' );
		} );

		it( 'rejects if the package name contains non-friendly URL characters - check !', () => {
			const error = validatePackageName( '@ckeditor/ckeditor5-foo!foo' );

			expect( error ).to.equal( 'The package name contains non-allowed characters.' );
		} );

		it( 'rejects if the package name contains non-friendly URL characters - check (', () => {
			const error = validatePackageName( '@ckeditor/ckeditor5-foo(foo' );

			expect( error ).to.equal( 'The package name contains non-allowed characters.' );
		} );

		it( 'rejects if the package name contains non-friendly URL characters - check )', () => {
			const error = validatePackageName( '@ckeditor/ckeditor5-foo)foo' );

			expect( error ).to.equal( 'The package name contains non-allowed characters.' );
		} );

		it( 'rejects if the package name contains non-friendly URL characters - check *', () => {
			const error = validatePackageName( '@ckeditor/ckeditor5-foo*foo' );

			expect( error ).to.equal( 'The package name contains non-allowed characters.' );
		} );

		it( 'rejects if the scope contains non-alphanumeric characters', () => {
			const error = validatePackageName( '@ćkèditör/ckeditor5-foo' );

			expect( error ).to.equal( 'The package name contains non-allowed characters.' );
		} );

		it( 'rejects if the package name contains non-alphanumeric characters', () => {
			const error = validatePackageName( '@ckeditor/ckeditor5-fø' );

			expect( error ).to.equal( 'The package name contains non-allowed characters.' );
		} );
	} );

	it( 'returns null for a valid package name', () => {
		const error = validatePackageName( '@scope/ckeditor5-test-package' );

		expect( error ).to.equal( null );
	} );
} );

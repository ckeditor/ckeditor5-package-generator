/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

const { expect } = require( 'chai' );

describe( 'lib/utils/get-dll-configuration', () => {
	let getDllConfiguration;

	beforeEach( () => {
		getDllConfiguration = require( '../../lib/utils/get-dll-configuration' );
	} );

	it( 'should be a function', () => {
		expect( getDllConfiguration ).to.be.a( 'function' );
	} );

	it( 'returns correct data for a one word package name', () => {
		const result = getDllConfiguration( '@foo/ckeditor5-bar' );

		expect( result ).to.deep.equal( {
			fileName: 'bar.js',
			library: 'bar'
		} );
	} );

	it( 'returns correct data for a two word package name', () => {
		const result = getDllConfiguration( '@foo/ckeditor5-bar-baz' );

		expect( result ).to.deep.equal( {
			fileName: 'bar-baz.js',
			library: 'barBaz'
		} );
	} );

	it( 'returns correct data for a three word package name', () => {
		const result = getDllConfiguration( '@foo/ckeditor5-bar-baz-qux' );

		expect( result ).to.deep.equal( {
			fileName: 'bar-baz-qux.js',
			library: 'barBazQux'
		} );
	} );
} );

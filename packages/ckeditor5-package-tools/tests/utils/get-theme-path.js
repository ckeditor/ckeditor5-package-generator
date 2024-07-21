/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const mockery = require( 'mockery' );
const sinon = require( 'sinon' );
const expect = require( 'chai' ).expect;

describe( 'lib/utils/get-theme-path', () => {
	let getThemePath;

	beforeEach( () => {
		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

		getThemePath = require( '../../lib/utils/get-theme-path' );
	} );

	afterEach( () => {
		sinon.restore();
		mockery.disable();
	} );

	it( 'should be a function', () => {
		expect( getThemePath ).to.be.a( 'function' );
	} );

	it( 'resolves the "@ckeditor/ckeditor5-theme-lark" package', () => {
		const resolver = packageName => packageName;
		expect( getThemePath( resolver ) ).to.equal( '@ckeditor/ckeditor5-theme-lark' );
	} );
} );

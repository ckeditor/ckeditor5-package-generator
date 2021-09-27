/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

const expect = require( 'chai' ).expect;

describe( 'lib/utils/get-karma-config', () => {
	let getKarmaConfig;

	beforeEach( () => {
		getKarmaConfig = require( '../../lib/utils/get-karma-config' );
	} );

	it( 'should be a function', () => {
		expect( getKarmaConfig ).to.be.a( 'function' );
	} );
	// TODO: Add tests.
} );

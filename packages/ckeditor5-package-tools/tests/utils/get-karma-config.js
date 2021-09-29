/**
 * @license Copyright (c) 2020-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
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

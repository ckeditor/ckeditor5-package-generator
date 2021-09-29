/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const expect = require( 'chai' ).expect;

describe( 'lib/utils/get-webpack-config-server', () => {
	let getWebpackConfigServer;

	beforeEach( () => {
		getWebpackConfigServer = require( '../../lib/utils/get-webpack-config-server' );
	} );

	it( 'should be a function', () => {
		expect( getWebpackConfigServer ).to.be.a( 'function' );
	} );
	// TODO: Add tests.
} );

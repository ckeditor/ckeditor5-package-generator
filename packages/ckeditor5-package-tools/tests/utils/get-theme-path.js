/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const mockery = require( 'mockery' );
const sinon = require( 'sinon' );
const expect = require( 'chai' ).expect;

describe( 'lib/utils/get-theme-path', () => {
	let getThemePath, stubs;

	const cwd = '/process/cwd';

	beforeEach( () => {
		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

		stubs = {
			packageJson: {
				name: '@ckeditor/ckeditor5-theme-lark',
				main: './theme/theme.css'
			},
			path: {
				join: sinon.stub().callsFake( ( ...chunks ) => chunks.join( '/' ).replace( '/./', '/' ) )
			}
		};

		mockery.registerMock( 'path', stubs.path );
		mockery.registerMock( '/process/cwd/node_modules/@ckeditor/ckeditor5-theme-lark/package.json', stubs.packageJson );

		getThemePath = require( '../../lib/utils/get-theme-path' );
	} );

	afterEach( () => {
		sinon.restore();
		mockery.disable();
	} );

	it( 'should be a function', () => {
		expect( getThemePath ).to.be.a( 'function' );
	} );

	it( 'returns an absolute path to an entry file of the "@ckeditor/ckeditor5-theme-lark" package', () => {
		expect( getThemePath( cwd ) ).to.equal( '/process/cwd/node_modules/@ckeditor/ckeditor5-theme-lark/theme/theme.css' );
	} );
} );

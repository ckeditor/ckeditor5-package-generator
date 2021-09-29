/**
 * @license Copyright (c) 2020-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const mockery = require( 'mockery' );
const sinon = require( 'sinon' );
const expect = require( 'chai' ).expect;

describe( 'lib/utils/get-webpack-config-dll', () => {
	let getWebpackConfigDll, stubs;

	const cwd = '/process/cwd';

	beforeEach( () => {
		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

		stubs = {
			packageJson: {
				name: '@ckeditor/ckeditor5-foo'
			},
			ckeditor5manifest: {
				name: 'CKEditor5.dll',
				content: {}
			},
			path: {
				join: sinon.stub().callsFake( ( ...chunks ) => chunks.join( '/' ) ),
				resolve: sinon.stub().callsFake( file => `/process/cwd/${ file }` )
			},
			webpack: sinon.stub(),
			dllReferencePlugin: sinon.stub()
		};

		stubs.webpack.DllReferencePlugin = function( ...args ) {
			return stubs.dllReferencePlugin( ...args );
		};

		mockery.registerMock( 'path', stubs.path );
		mockery.registerMock( 'webpack', stubs.webpack );
		mockery.registerMock( '/process/cwd/node_modules/ckeditor5/build/ckeditor5-dll.manifest.json', stubs.ckeditor5manifest );
		mockery.registerMock( '/process/cwd/node_modules/@ckeditor/ckeditor5-theme-lark/package.json', {
			main: './theme/theme.css'
		} );
		mockery.registerMock( '/process/cwd/package.json', stubs.packageJson );

		getWebpackConfigDll = require( '../../lib/utils/get-webpack-config-dll' );
	} );

	afterEach( () => {
		mockery.deregisterAll();
		mockery.disable();
	} );

	it( 'should be a function', () => {
		expect( getWebpackConfigDll ).to.be.a( 'function' );
	} );

	describe( 'verifying exposed DLL names', () => {
		it( 'returns "foo" for a window key and a file name for the "@ckeditor/ckeditor5-foo" package', () => {
			const webpackConfig = getWebpackConfigDll( { cwd } );

			expect( webpackConfig.output.filename ).to.equal( 'foo.js' );
			expect( webpackConfig.output.library ).to.deep.equal( [ 'CKEditor5', 'foo' ] );
		} );

		it( 'returns "fooBar" for a window key and "foo-bar" a file name for the "@ckeditor/ckeditor5-foo-bar" package', () => {
			stubs.packageJson.name = '@ckeditor/ckeditor5-foo-bar';

			const webpackConfig = getWebpackConfigDll( { cwd } );

			expect( webpackConfig.output.filename ).to.equal( 'foo-bar.js' );
			expect( webpackConfig.output.library ).to.deep.equal( [ 'CKEditor5', 'fooBar' ] );
		} );
	} );
	// TODO: Add more tests.
} );

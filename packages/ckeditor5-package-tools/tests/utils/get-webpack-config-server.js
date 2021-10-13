/**
 * @license Copyright (c) 2020-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const mockery = require( 'mockery' );
const sinon = require( 'sinon' );
const expect = require( 'chai' ).expect;

describe( 'lib/utils/get-webpack-config-server', () => {
	let getWebpackConfigServer, stubs;

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
			path: {
				join: sinon.stub().callsFake( ( ...chunks ) => chunks.join( '/' ) ),
				resolve: sinon.stub().callsFake( file => `/process/cwd/${ file }` )
			},
			devUtils: {
				styles: {
					getPostCssConfig: sinon.stub()
				}
			},
			getThemePath: sinon.stub(),
			webpack: sinon.stub(),
			providePlugin: sinon.stub()
		};

		stubs.webpack.ProvidePlugin = function( ...args ) {
			return stubs.providePlugin( ...args );
		};

		mockery.registerMock( 'path', stubs.path );
		mockery.registerMock( 'webpack', stubs.webpack );
		mockery.registerMock( '@ckeditor/ckeditor5-dev-utils', stubs.devUtils );
		mockery.registerMock( './get-theme-path', stubs.getThemePath );

		getWebpackConfigServer = require( '../../lib/utils/get-webpack-config-server' );
	} );

	afterEach( () => {
		mockery.deregisterAll();
		mockery.disable();
	} );

	it( 'should be a function', () => {
		expect( getWebpackConfigServer ).to.be.a( 'function' );
	} );

	it( 'processes the "script.js" file', () => {
		const config = getWebpackConfigServer( { cwd } );

		expect( config.entry ).to.equal( '/process/cwd/sample/script.js' );
		expect( config.output ).to.deep.equal( {
			filename: 'script.dist.js',
			path: '/process/cwd/sample'
		} );
	} );

	it( 'loads "process" polyfill for webpack 5', () => {
		getWebpackConfigServer( { cwd } );

		expect( stubs.providePlugin.calledOnce ).to.equal( true );
		expect( stubs.providePlugin.firstCall.firstArg ).to.be.an( 'object' );
		expect( stubs.providePlugin.firstCall.firstArg ).to.have.property( 'process', 'process/browser' );
	} );

	it( 'loads "Buffer" polyfill for webpack 5', () => {
		getWebpackConfigServer( { cwd } );

		expect( stubs.providePlugin.calledOnce ).to.equal( true );
		expect( stubs.providePlugin.firstCall.firstArg ).to.be.an( 'object' );
		expect( stubs.providePlugin.firstCall.firstArg ).to.have.property( 'Buffer' );
		expect( stubs.providePlugin.firstCall.firstArg.Buffer ).to.deep.equal( [ 'buffer', 'Buffer' ] );
	} );

	it( 'defines the configuration for an HTTP server', () => {
		const config = getWebpackConfigServer( { cwd } );

		expect( config.devServer ).to.deep.equal( {
			static: {
				directory: '/process/cwd/sample'
			},
			compress: true
		} );
	} );

	describe( 'loaders', () => {
		let webpackConfig;

		beforeEach( () => {
			stubs.getThemePath.returns( '/process/cwd/node_modules/@ckeditor/ckeditor5-theme/theme/theme.css' );
			stubs.devUtils.styles.getPostCssConfig.returns( { foo: true } );

			webpackConfig = getWebpackConfigServer( { cwd } );
		} );

		describe( '*.svg', () => {
			let loader;

			beforeEach( () => {
				loader = webpackConfig.module.rules.find( loader => loader.test.toString().includes( 'svg' ) );

				expect( loader ).is.an( 'object' );
			} );

			it( 'uses "raw-loader" for providing files', () => {
				expect( loader.use ).to.equal( 'raw-loader' );
			} );

			it( 'loads paths that end with the ".svg" suffix', () => {
				expect( '/Users/ckeditor/ckeditor5-foo/theme/icons/ckeditor.svg' ).to.match( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\theme\\icons\\ckeditor.svg' ).to.match( loader.test );

				expect( '/Users/ckeditor/ckeditor5-foo/theme/icons/ckeditor.css' ).to.not.match( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\theme\\icons\\ckeditor.css' ).to.not.match( loader.test );
			} );
		} );

		describe( '*.css', () => {
			let loader;

			beforeEach( () => {
				loader = webpackConfig.module.rules.find( loader => loader.test.toString().includes( 'css' ) );

				expect( loader ).is.an( 'object' );
				expect( loader.use ).is.an( 'array' );
				expect( loader.use ).to.lengthOf( 3 );
			} );

			// Webpack processes loaders from the bottom, to the top. Hence, "postcss-loader" will be called as the first one.
			it( 'uses "postcss-loader" for processing CKEditor 5 assets', () => {
				expect( stubs.getThemePath.calledOnce ).to.equal( true );
				expect( stubs.getThemePath.firstCall.args[ 0 ] ).to.equal( '/process/cwd' );

				expect( stubs.devUtils.styles.getPostCssConfig.calledOnce ).to.equal( true );
				expect( stubs.devUtils.styles.getPostCssConfig.firstCall.firstArg ).to.deep.equal( {
					minify: true,
					themeImporter: {
						themePath: '/process/cwd/node_modules/@ckeditor/ckeditor5-theme/theme/theme.css'
					}
				} );

				const postcssLoader = loader.use.slice( -1 ).pop();

				expect( postcssLoader ).to.be.an( 'object' );

				expect( postcssLoader ).to.haveOwnProperty( 'loader' );
				expect( postcssLoader.loader ).to.equal( 'postcss-loader' );

				expect( postcssLoader ).to.haveOwnProperty( 'options' );
				expect( postcssLoader.options ).to.deep.equal( {
					postcssOptions: { foo: true }
				} );
			} );

			it( 'uses "css-loader" to resolve imports from JS files', () => {
				const cssLoader = loader.use.slice( 1, -1 ).pop();

				expect( cssLoader ).to.equal( 'css-loader' );
			} );

			it( 'uses "style-loader" for injecting processed styles on a page', () => {
				const styleLoader = loader.use.slice( 0 ).shift();

				expect( styleLoader ).to.haveOwnProperty( 'loader' );
				expect( styleLoader.loader ).to.equal( 'style-loader' );

				expect( styleLoader ).to.haveOwnProperty( 'options' );
				expect( styleLoader.options ).to.deep.equal( {
					injectType: 'singletonStyleTag',
					attributes: {
						'data-cke': true
					}
				} );
			} );

			it( 'loads paths that end with the ".css" suffix', () => {
				expect( '/Users/ckeditor/ckeditor5-foo/theme/icons/ckeditor.css' ).to.match( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\theme\\icons\\ckeditor.css' ).to.match( loader.test );

				expect( '/Users/ckeditor/ckeditor5-foo/theme/icons/ckeditor.html' ).to.not.match( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\theme\\icons\\ckeditor.html' ).to.not.match( loader.test );
			} );
		} );
	} );
} );

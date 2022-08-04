/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const mockery = require( 'mockery' );
const sinon = require( 'sinon' );
const expect = require( 'chai' ).expect;

describe( 'lib/utils/common-webpack-config', () => {
	let commonWebpackConfig, stubs;

	const cwd = '/process/cwd';

	beforeEach( () => {
		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

		stubs = {
			devUtils: {
				styles: {
					getPostCssConfig: sinon.stub()
				}
			},
			getThemePath: sinon.stub()
		};

		stubs.devUtils.styles.getPostCssConfig.returns( { foo: true } );
		stubs.getThemePath.returns( cwd + '/node_modules/@ckeditor/ckeditor5-theme/theme/theme.css' );

		mockery.registerMock( '@ckeditor/ckeditor5-dev-utils', stubs.devUtils );
		mockery.registerMock( './get-theme-path', stubs.getThemePath );

		commonWebpackConfig = require( '../../lib/utils/common-webpack-config' );
	} );

	afterEach( () => {
		sinon.restore();
		mockery.disable();
	} );

	it( 'should be a function', () => {
		expect( commonWebpackConfig ).to.be.a( 'function' );
	} );

	it( 'allows resolving "*.ts" files', () => {
		expect( commonWebpackConfig( cwd ).resolve.extensions ).to.deep.equal( [ '.ts', '...' ] );
	} );

	describe( 'loaders', () => {
		describe( '*.svg', () => {
			let loader;

			beforeEach( () => {
				loader = commonWebpackConfig( cwd ).module.rules.find( loader => loader.test.toString().includes( 'svg' ) );

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

		describe( '*.txt', () => {
			let loader;

			beforeEach( () => {
				loader = commonWebpackConfig( cwd ).module.rules.find( loader => loader.test.toString().includes( 'txt' ) );

				expect( loader ).is.an( 'object' );
			} );

			it( 'uses "raw-loader" for providing files', () => {
				expect( loader.use ).to.equal( 'raw-loader' );
			} );

			it( 'loads paths that end with the ".txt" suffix', () => {
				expect( '/Users/ckeditor/ckeditor5-foo/assets/ckeditor.txt' ).to.match( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\assets\\ckeditor.txt' ).to.match( loader.test );

				expect( '/Users/ckeditor/ckeditor5-foo/theme/icons/ckeditor.css' ).to.not.match( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\theme\\icons\\ckeditor.css' ).to.not.match( loader.test );
			} );
		} );

		describe( '*.html', () => {
			let loader;

			beforeEach( () => {
				loader = commonWebpackConfig( cwd ).module.rules.find( loader => loader.test.toString().includes( 'html' ) );

				expect( loader ).is.an( 'object' );
			} );

			it( 'uses "raw-loader" for providing files', () => {
				expect( loader.use ).to.equal( 'raw-loader' );
			} );

			it( 'loads paths that end with the ".html" suffix', () => {
				expect( '/Users/ckeditor/ckeditor5-foo/assets/ckeditor.html' ).to.match( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\assets\\ckeditor.html' ).to.match( loader.test );

				expect( '/Users/ckeditor/ckeditor5-foo/theme/icons/ckeditor.css' ).to.not.match( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\theme\\icons\\ckeditor.css' ).to.not.match( loader.test );
			} );
		} );

		describe( '*.rtf', () => {
			let loader;

			beforeEach( () => {
				loader = commonWebpackConfig( cwd ).module.rules.find( loader => loader.test.toString().includes( 'rtf' ) );

				expect( loader ).is.an( 'object' );
			} );

			it( 'uses "raw-loader" for providing files', () => {
				expect( loader.use ).to.equal( 'raw-loader' );
			} );

			it( 'loads paths that end with the ".rtf" suffix', () => {
				expect( '/Users/ckeditor/ckeditor5-foo/assets/ckeditor.rtf' ).to.match( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\assets\\ckeditor.rtf' ).to.match( loader.test );

				expect( '/Users/ckeditor/ckeditor5-foo/theme/icons/ckeditor.css' ).to.not.match( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\theme\\icons\\ckeditor.css' ).to.not.match( loader.test );
			} );
		} );

		describe( '*.ts', () => {
			let loader;

			beforeEach( () => {
				loader = commonWebpackConfig( cwd ).module.rules.find( loader => loader.test.toString().includes( 'ts' ) );

				expect( loader ).is.an( 'object' );
			} );

			it( 'uses "ts-loader" for providing files', () => {
				expect( loader.use ).to.equal( 'ts-loader' );
			} );

			it( 'loads paths that end with the ".ts" suffix', () => {
				expect( '/Users/ckeditor/ckeditor5-foo/assets/ckeditor.ts' ).to.match( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\assets\\ckeditor.ts' ).to.match( loader.test );

				expect( '/Users/ckeditor/ckeditor5-foo/assets/ckeditor.js' ).to.not.match( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\assets\\ckeditor.js' ).to.not.match( loader.test );
			} );
		} );

		describe( '*.css', () => {
			let loader;

			beforeEach( () => {
				loader = commonWebpackConfig( cwd ).module.rules.find( loader => loader.test.toString().includes( 'css' ) );

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

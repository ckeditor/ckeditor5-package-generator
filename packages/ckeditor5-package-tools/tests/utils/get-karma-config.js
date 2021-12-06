/**
 * @license Copyright (c) 2020-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const sinon = require( 'sinon' );
const mockery = require( 'mockery' );
const expect = require( 'chai' ).expect;

describe( 'lib/utils/get-karma-config', () => {
	let getKarmaConfig, stubs;

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
			getThemePath: sinon.stub()
		};

		mockery.registerMock( 'path', stubs.path );
		mockery.registerMock( '@ckeditor/ckeditor5-dev-utils', stubs.devUtils );
		mockery.registerMock( './get-theme-path', stubs.getThemePath );

		getKarmaConfig = require( '../../lib/utils/get-karma-config' );
	} );

	afterEach( () => {
		sinon.restore();
		mockery.disable();
	} );

	it( 'should be a function', () => {
		expect( getKarmaConfig ).to.be.a( 'function' );
	} );

	it( 'defines "webpack" in the "#frameworks" property', () => {
		const config = getKarmaConfig( { cwd } );

		expect( config.frameworks ).to.be.an( 'array' );
		expect( config.frameworks ).to.contain( 'webpack' );
	} );

	it( 'uses no sandbox version of Chrome when executing on CI', () => {
		const envCI = process.env.CI;
		process.env.CI = true;

		const config = getKarmaConfig( { cwd } );

		expect( config.browsers ).to.deep.equal( [ 'CHROME_TRAVIS_CI' ] );

		process.env.CI = envCI;
	} );

	it( 'enables watching source files when passed the watch option', () => {
		const config = getKarmaConfig( { cwd, verbose: true } );

		expect( config.webpackMiddleware ).to.deep.equal( {
			noInfo: false
		} );
	} );

	it( 'enables printing webpack logs when passed the verbose option', () => {
		const config = getKarmaConfig( { cwd, watch: true } );

		expect( config.autoWatch ).to.equal( true );
		expect( config.singleRun ).to.equal( false );
	} );

	describe( 'webpack configuration', () => {
		describe( 'loaders', () => {
			let webpackConfig;

			beforeEach( () => {
				stubs.getThemePath.returns( '/process/cwd/node_modules/@ckeditor/ckeditor5-theme/theme/theme.css' );
				stubs.devUtils.styles.getPostCssConfig.returns( { foo: true } );

				webpackConfig = getKarmaConfig( { cwd } ).webpack;
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

			describe( '*.txt', () => {
				let loader;

				beforeEach( () => {
					loader = webpackConfig.module.rules.find( loader => loader.test.toString().includes( 'txt' ) );

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
					loader = webpackConfig.module.rules.find( loader => loader.test.toString().includes( 'html' ) );

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
					loader = webpackConfig.module.rules.find( loader => loader.test.toString().includes( 'rtf' ) );

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

			describe( '*.js (code coverage)', () => {
				let loader;

				beforeEach( () => {
					webpackConfig = getKarmaConfig( { cwd, coverage: true } ).webpack;

					loader = webpackConfig.module.rules.find( loader => loader.test.toString().includes( 'js' ) );

					expect( loader ).is.an( 'object' );
				} );

				it( 'uses "istanbul-instrumenter-loader" for providing files', () => {
					expect( loader.loader ).to.equal( 'istanbul-instrumenter-loader' );
					expect( loader.include ).to.equal( '/process/cwd/src' );
					expect( loader.options ).to.deep.equal( {
						esModules: true
					} );
				} );

				it( 'loads paths that end with the ".js" suffix', () => {
					expect( '/Users/ckeditor/ckeditor5-foo/src/ckeditor.js' ).to.match( loader.test );
					expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\src\\ckeditor.js' ).to.match( loader.test );

					expect( '/Users/ckeditor/ckeditor5-foo/theme/icons/ckeditor.css' ).to.not.match( loader.test );
					expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\theme\\icons\\ckeditor.css' ).to.not.match( loader.test );
				} );
			} );
		} );

		it( 'allows enabling source maps', () => {
			const config = getKarmaConfig( { cwd, sourceMap: true } );

			expect( config.webpack.devtool ).to.equal( 'eval-cheap-module-source-map' );
		} );
	} );
} );

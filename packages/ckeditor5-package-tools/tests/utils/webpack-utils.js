/**
 * @license Copyright (c) 2020-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const mockery = require( 'mockery' );
const sinon = require( 'sinon' );
const expect = require( 'chai' ).expect;

describe( 'lib/utils/webpack-utils', () => {
	let webpackUtils, stubs;

	const cwd = '/process/cwd';
	const themePath = cwd + '/node_modules/@ckeditor/ckeditor5-theme/theme/theme.css';

	beforeEach( () => {
		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

		stubs = {
			path: {
				join: sinon.stub().callsFake( ( ...chunks ) => chunks.join( '/' ) ),
				resolve: sinon.stub().callsFake( ( ...chunks ) => chunks.join( '/' ) )
			},
			getThemePath: sinon.stub(),
			devUtils: {
				styles: {
					getPostCssConfig: sinon.stub()
				}
			}
		};

		stubs.devUtils.styles.getPostCssConfig.returns( { foo: true } );
		stubs.getThemePath.returns( themePath );

		mockery.registerMock( 'path', stubs.path );
		mockery.registerMock( './get-theme-path', stubs.getThemePath );
		mockery.registerMock( '@ckeditor/ckeditor5-dev-utils', stubs.devUtils );

		webpackUtils = require( '../../lib/utils/webpack-utils' );
	} );

	afterEach( () => {
		sinon.restore();
		mockery.disable();
	} );

	describe( 'loaderDefinitions', () => {
		describe( 'raw()', () => {
			let loader;

			beforeEach( () => {
				loader = webpackUtils.loaderDefinitions.raw();
			} );

			it( 'uses "raw-loader" for providing files', () => {
				expect( loader.loader ).to.equal( 'raw-loader' );
			} );

			it( 'loads paths that end with the ".svg" suffix', () => {
				expect( '/Users/ckeditor/ckeditor5-foo/theme/icons/ckeditor.svg' ).to.match( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\theme\\icons\\ckeditor.svg' ).to.match( loader.test );

				expect( '/Users/ckeditor/ckeditor5-foo/theme/icons/ckeditor.css' ).to.not.match( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\theme\\icons\\ckeditor.css' ).to.not.match( loader.test );
			} );

			it( 'loads paths that end with the ".txt" suffix', () => {
				expect( '/Users/ckeditor/ckeditor5-foo/assets/ckeditor.txt' ).to.match( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\assets\\ckeditor.txt' ).to.match( loader.test );

				expect( '/Users/ckeditor/ckeditor5-foo/theme/icons/ckeditor.css' ).to.not.match( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\theme\\icons\\ckeditor.css' ).to.not.match( loader.test );
			} );

			it( 'loads paths that end with the ".html" suffix', () => {
				expect( '/Users/ckeditor/ckeditor5-foo/assets/ckeditor.html' ).to.match( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\assets\\ckeditor.html' ).to.match( loader.test );

				expect( '/Users/ckeditor/ckeditor5-foo/theme/icons/ckeditor.css' ).to.not.match( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\theme\\icons\\ckeditor.css' ).to.not.match( loader.test );
			} );

			it( 'loads paths that end with the ".rtf" suffix', () => {
				expect( '/Users/ckeditor/ckeditor5-foo/assets/ckeditor.rtf' ).to.match( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\assets\\ckeditor.rtf' ).to.match( loader.test );

				expect( '/Users/ckeditor/ckeditor5-foo/theme/icons/ckeditor.css' ).to.not.match( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\theme\\icons\\ckeditor.css' ).to.not.match( loader.test );
			} );
		} );

		describe( 'typescript()', () => {
			let loader;

			beforeEach( () => {
				loader = webpackUtils.loaderDefinitions.typescript( cwd );
			} );

			it( 'uses "ts-loader" for providing files', () => {
				expect( loader.loader ).to.equal( 'ts-loader' );
			} );

			it( 'loads paths that end with the ".ts" suffix', () => {
				expect( '/Users/ckeditor/ckeditor5-foo/assets/ckeditor.ts' ).to.match( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\assets\\ckeditor.ts' ).to.match( loader.test );

				expect( '/Users/ckeditor/ckeditor5-foo/assets/ckeditor.js' ).to.not.match( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\assets\\ckeditor.js' ).to.not.match( loader.test );
			} );

			it( 'passes default values to loader options', () => {
				expect( loader.options ).to.be.an( 'object' );
				expect( loader.options ).to.have.property( 'configFile', '/process/cwd/tsconfig.json' );
			} );

			it( 'allows defining custom tsconfig file', () => {
				loader = webpackUtils.loaderDefinitions.typescript( cwd, 'tsconfig.test.json' );

				expect( loader.options ).to.be.an( 'object' );
				expect( loader.options ).to.have.property( 'configFile', '/process/cwd/tsconfig.test.json' );
			} );
		} );

		describe( 'coverage()', () => {
			let loader;

			beforeEach( () => {
				loader = webpackUtils.loaderDefinitions.coverage( cwd );
			} );

			it( 'uses "ts-loader" for providing files', () => {
				expect( loader.loader ).to.equal( 'istanbul-instrumenter-loader' );
			} );

			it( 'loads correct files', () => {
				expect( loader.include ).to.equal( '/process/cwd/src' );
			} );

			it( 'has correct options set', () => {
				expect( loader.options ).to.deep.equal( { esModules: true } );
			} );

			it( 'loads paths that end with the ".js" suffix', () => {
				expect( '/Users/ckeditor/ckeditor5-foo/assets/ckeditor.js' ).to.match( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\assets\\ckeditor.js' ).to.match( loader.test );

				expect( '/Users/ckeditor/ckeditor5-foo/assets/ckeditor.jsx' ).to.not.match( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\assets\\ckeditor.jsx' ).to.not.match( loader.test );
			} );

			it( 'loads paths that end with the ".ts" suffix', () => {
				expect( '/Users/ckeditor/ckeditor5-foo/assets/ckeditor.ts' ).to.match( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\assets\\ckeditor.ts' ).to.match( loader.test );

				expect( '/Users/ckeditor/ckeditor5-foo/assets/ckeditor.jsx' ).to.not.match( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\assets\\ckeditor.jsx' ).to.not.match( loader.test );
			} );
		} );

		describe( 'styles()', () => {
			let loader;

			beforeEach( () => {
				loader = webpackUtils.loaderDefinitions.styles( cwd );

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
					themeImporter: { themePath }
				} );

				const postcssLoader = loader.use[ 2 ];

				expect( postcssLoader ).to.be.an( 'object' );

				expect( postcssLoader ).to.haveOwnProperty( 'loader' );
				expect( postcssLoader.loader ).to.equal( 'postcss-loader' );

				expect( postcssLoader ).to.haveOwnProperty( 'options' );
				expect( postcssLoader.options ).to.deep.equal( {
					postcssOptions: { foo: true }
				} );
			} );

			it( 'uses "css-loader" to resolve imports from JS files', () => {
				const cssLoader = loader.use[ 1 ];

				expect( cssLoader ).to.equal( 'css-loader' );
			} );

			it( 'uses "style-loader" for injecting processed styles on a page', () => {
				const styleLoader = loader.use[ 0 ];

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

	describe( 'getModuleResolutionPaths()', () => {
		let moduleResolutionPaths;

		beforeEach( () => {
			moduleResolutionPaths = webpackUtils.getModuleResolutionPaths( 'root/directory' );
		} );

		it( 'loads "node_modules" directly', () => {
			expect( moduleResolutionPaths[ 0 ] ).to.equal( 'node_modules' );
		} );

		it( 'loads "node_modules" from root of the "ckeditor5-package-tools" package', () => {
			expect( moduleResolutionPaths[ 1 ] ).to.equal( 'root/directory/node_modules' );

			expect( stubs.path.resolve.callCount ).to.equal( 1 );
			expect( stubs.path.resolve.getCall( 0 ).args ).to.deep.equal(
				[ 'root/directory', 'node_modules' ]
			);
		} );
	} );
} );

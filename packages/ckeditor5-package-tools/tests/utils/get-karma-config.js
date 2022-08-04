/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
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
			commonWebpackConfig: sinon.stub()
		};

		stubs.commonWebpackConfig.callsFake( cwd => ( {
			resolve: {
				extensions: [ '.foo', '...' ]
			},
			module: {
				rules: [
					{
						test: /\.foo$/,
						use: 'foo-loader',
						options: cwd
					}
				]
			}
		} ) );

		mockery.registerMock( 'path', stubs.path );
		mockery.registerMock( './common-webpack-config', stubs.commonWebpackConfig );

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

	it( 'uses sandboxed version of Chrome when executing on local environment', () => {
		const envCI = process.env.CI;
		process.env.CI = false;

		const config = getKarmaConfig( { cwd } );

		expect( config.browsers ).to.deep.equal( [ 'CHROME_LOCAL' ] );

		process.env.CI = envCI;
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
		it( 'contains common webpack config parts', () => {
			const config = getKarmaConfig( { cwd } );

			expect( config.webpack.resolve.extensions ).to.deep.equal( [ '.foo', '...' ] );
			expect( config.webpack.module.rules ).to.deep.equal( [
				{
					test: /\.foo$/,
					use: 'foo-loader',
					options: cwd
				}
			] );
		} );

		it( 'has mode set to "development"', () => {
			const config = getKarmaConfig( { cwd } );

			expect( config.webpack.mode ).to.equal( 'development' );
		} );

		it( 'has node_modules defined in "resolveLoader"', () => {
			const config = getKarmaConfig( { cwd } );

			expect( config.webpack.resolveLoader ).to.deep.equal( { modules: [ 'node_modules' ] } );
		} );

		it( 'allows enabling source maps', () => {
			const config = getKarmaConfig( { cwd, sourceMap: true } );

			expect( config.webpack.devtool ).to.equal( 'eval-cheap-module-source-map' );
		} );

		describe( '*.js and *.ts (code coverage)', () => {
			let loader;

			beforeEach( () => {
				const webpackConfig = getKarmaConfig( { cwd, coverage: true } ).webpack;

				loader = webpackConfig.module.rules.find( loader => loader.test.toString().includes( '[jt]s' ) );

				expect( loader ).is.an( 'object' );
			} );

			it( 'uses "istanbul-instrumenter-loader" for providing files', () => {
				expect( loader.loader ).to.equal( 'istanbul-instrumenter-loader' );
				expect( loader.include ).to.equal( '/process/cwd/src' );
				expect( loader.options ).to.deep.equal( {
					esModules: true
				} );
			} );

			it( 'loads paths that end with the ".js" or ".ts" suffix', () => {
				expect( '/Users/ckeditor/ckeditor5-foo/src/ckeditor.js' ).to.match( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\src\\ckeditor.js' ).to.match( loader.test );

				expect( '/Users/ckeditor/ckeditor5-foo/src/ckeditor.ts' ).to.match( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\src\\ckeditor.ts' ).to.match( loader.test );

				expect( '/Users/ckeditor/ckeditor5-foo/theme/icons/ckeditor.css' ).to.not.match( loader.test );
				expect( 'C:\\Users\\ckeditor\\ckeditor5-foo\\theme\\icons\\ckeditor.css' ).to.not.match( loader.test );
			} );
		} );
	} );
} );

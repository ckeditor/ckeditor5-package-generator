/**
 * @license Copyright (c) 2020-2023, CKSource Holding sp. z o.o. All rights reserved.
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
			webpackUtils: {
				loaderDefinitions: {
					raw: sinon.stub(),
					styles: sinon.stub(),
					coverage: sinon.stub(),
					typescript: sinon.stub()
				}
			}
		};

		stubs.webpackUtils.loaderDefinitions.raw.returns( 'raw-loader' );
		stubs.webpackUtils.loaderDefinitions.typescript.returns( 'typescript-loader' );
		stubs.webpackUtils.loaderDefinitions.styles.withArgs( cwd ).returns( 'styles-loader' );
		stubs.webpackUtils.loaderDefinitions.coverage.withArgs( cwd ).returns( 'coverage-loader' );

		mockery.registerMock( 'path', stubs.path );
		mockery.registerMock( './webpack-utils', stubs.webpackUtils );

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
		it( 'uses correct loaders', () => {
			const config = getKarmaConfig( { cwd } );

			expect( config.webpack.module.rules ).to.deep.equal( [
				'raw-loader',
				'styles-loader',
				'typescript-loader'
			] );
		} );

		it( 'uses correct loaders (code coverage)', () => {
			const config = getKarmaConfig( { cwd, coverage: true } );

			expect( config.webpack.module.rules ).to.deep.equal( [
				'coverage-loader',
				'raw-loader',
				'styles-loader',
				'typescript-loader'
			] );
		} );

		it( 'resolves correct file extensions', () => {
			const config = getKarmaConfig( { cwd } );

			expect( config.webpack.resolve.extensions ).to.deep.equal( [ '.ts', '...' ] );
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
	} );
} );

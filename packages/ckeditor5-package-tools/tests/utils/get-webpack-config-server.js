/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
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
			fs: {
				readdirSync: sinon.stub()
			},
			path: {
				join: sinon.stub().callsFake( ( ...chunks ) => chunks.join( '/' ) ),
				resolve: sinon.stub().callsFake( file => `/process/cwd/${ file }` )
			},
			commonWebpackConfig: sinon.stub(),
			webpack: sinon.stub(),
			providePlugin: sinon.stub(),
			definePlugin: sinon.stub(),
			devWebpackPlugin: sinon.stub()
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

		stubs.fs.readdirSync.withArgs( '/process/cwd/sample' ).returns( [
			'ckeditor.js',
			'dll.html',
			'index.html'
		] );

		stubs.webpack.ProvidePlugin = function( ...args ) {
			return stubs.providePlugin( ...args );
		};

		stubs.webpack.DefinePlugin = function( ...args ) {
			return stubs.definePlugin( ...args );
		};

		mockery.registerMock( 'fs', stubs.fs );
		mockery.registerMock( 'path', stubs.path );
		mockery.registerMock( 'webpack', stubs.webpack );
		mockery.registerMock( './common-webpack-config', stubs.commonWebpackConfig );
		mockery.registerMock( '@ckeditor/ckeditor5-dev-webpack-plugin', stubs.devWebpackPlugin );

		getWebpackConfigServer = require( '../../lib/utils/get-webpack-config-server' );
	} );

	afterEach( () => {
		sinon.restore();
		mockery.disable();
	} );

	it( 'should be a function', () => {
		expect( getWebpackConfigServer ).to.be.a( 'function' );
	} );

	it( 'contains common webpack config parts', () => {
		const config = getWebpackConfigServer( { cwd } );

		expect( config.resolve.extensions ).to.deep.equal( [ '.foo', '...' ] );
		expect( config.module.rules ).to.deep.equal( [
			{
				test: /\.foo$/,
				use: 'foo-loader',
				options: cwd
			}
		] );
	} );

	it( 'processes the "ckeditor.js" file', () => {
		const config = getWebpackConfigServer( { cwd } );

		expect( config.entry ).to.equal( '/process/cwd/sample/ckeditor.js' );
		expect( config.output ).to.deep.equal( {
			filename: 'ckeditor.dist.js',
			path: '/process/cwd/sample'
		} );
	} );

	it( 'processes the "ckeditor.ts" file', () => {
		stubs.fs.readdirSync.withArgs( '/process/cwd/sample' ).returns( [
			'ckeditor.ts',
			'dll.html',
			'index.html'
		] );

		const config = getWebpackConfigServer( { cwd } );

		expect( config.entry ).to.equal( '/process/cwd/sample/ckeditor.ts' );
		expect( config.output ).to.deep.equal( {
			filename: 'ckeditor.dist.js',
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

	it( 'defines the development mode by default for an HTTP server', () => {
		const config = getWebpackConfigServer( { cwd } );

		expect( config.mode ).to.equal( 'development' );
	} );

	it( 'defines the production mode for an HTTP server', () => {
		const config = getWebpackConfigServer( { cwd, production: true } );

		expect( config.mode ).to.equal( 'production' );
	} );

	describe( 'sample language', () => {
		it( 'passes the specified language directly to source file', () => {
			getWebpackConfigServer( { cwd, language: 'en' } );

			expect( stubs.definePlugin.calledOnce ).to.equal( true );
			expect( stubs.definePlugin.firstCall.firstArg ).to.deep.equal( {
				EDITOR_LANGUAGE: '"en"'
			} );
		} );

		it( 'enables producing translations for non-English editors', () => {
			getWebpackConfigServer( { cwd, language: 'pl' } );

			expect( stubs.definePlugin.calledOnce ).to.equal( true );
			expect( stubs.definePlugin.firstCall.firstArg ).to.deep.equal( {
				EDITOR_LANGUAGE: '"pl"'
			} );

			expect( stubs.devWebpackPlugin.calledOnce ).to.equal( true );
			expect( stubs.devWebpackPlugin.firstCall.firstArg ).to.deep.equal( {
				language: 'pl',
				sourceFilesPattern: /src[/\\].+\.[jt]s$/
			} );
		} );
	} );
} );

/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const sinon = require( 'sinon' );
const expect = require( 'chai' ).expect;
const mockery = require( 'mockery' );

describe( 'lib/tasks/start', () => {
	let startTask, stubs;

	beforeEach( () => {
		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

		stubs = {
			webpackDevServerArguments: null,

			webpack: sinon.stub(),
			webpackConfig: sinon.stub(),
			server: {
				start: sinon.stub()
			}
		};

		mockery.registerMock( 'webpack', stubs.webpack );
		mockery.registerMock( 'webpack-dev-server', function( ...args ) {
			stubs.webpackDevServerArguments = args;

			return stubs.server;
		} );
		mockery.registerMock( '../utils/get-webpack-config-server', stubs.webpackConfig );

		startTask = require( '../../lib/tasks/start' );
	} );

	afterEach( () => {
		sinon.restore();
		mockery.disable();
	} );

	it( 'should be a function', () => {
		expect( startTask ).to.be.a( 'function' );
	} );

	it( 'should run webpack and enable server with the live-reloading mechanism', () => {
		const taskOptions = {
			cwd: '/cwd',
			open: true
		};

		// An example object returned by webpack marked as "compiler".
		const compiler = {
			type: 'compiler'
		};

		const webpackConfig = {
			mode: 'development',
			entry: 'file.js',
			devServer: {
				port: 9000
			}
		};

		// Mock reading the configuration.
		stubs.webpackConfig.returns( webpackConfig );

		// Webpack returns a compiler instance if callback is not specified.
		stubs.webpack.returns( compiler );

		// Execute the task.
		startTask( taskOptions );

		// Verify arguments passed to webpack-dev-server.
		expect( stubs.webpackDevServerArguments ).to.be.an( 'array' );
		expect( stubs.webpackDevServerArguments[ 0 ] ).to.deep.equal( {
			port: 9000,
			open: true
		} );
		expect( stubs.webpackDevServerArguments[ 1 ] ).to.equal( compiler );

		// Verify whether the server was started.
		expect( stubs.server.start.calledOnce ).to.equal( true );
	} );

	it( 'should not open the browser if the open option is set to false', () => {
		const taskOptions = {
			cwd: '/cwd',
			open: false
		};

		// An example object returned by webpack marked as "compiler".
		const compiler = {
			type: 'compiler'
		};

		const webpackConfig = {
			mode: 'development',
			entry: 'file.js',
			devServer: {
				port: 9000
			}
		};

		// Mock reading the configuration.
		stubs.webpackConfig.returns( webpackConfig );

		// Webpack returns a compiler instance if callback is not specified.
		stubs.webpack.returns( compiler );

		// Execute the task.
		startTask( taskOptions );

		// Verify arguments passed to webpack-dev-server.
		expect( stubs.webpackDevServerArguments ).to.be.an( 'array' );
		expect( stubs.webpackDevServerArguments[ 0 ] ).to.deep.equal( {
			port: 9000,
			open: false
		} );
	} );
} );

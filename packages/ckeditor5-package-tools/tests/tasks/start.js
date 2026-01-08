/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import getWebpackConfigServer from '../../lib/utils/get-webpack-config-server.js';
import startTask from '../../lib/tasks/start.js';

vi.mock( 'webpack' );
vi.mock( 'webpack-dev-server' );
vi.mock( '../../lib/utils/get-webpack-config-server.js' );

describe( 'lib/tasks/start', () => {
	beforeEach( () => {
		vi.mocked( WebpackDevServer ).mockImplementation(
			class MockWebpackDevServer {
				start() {};
			}
		);
	} );

	it( 'should be a function', () => {
		expect( startTask ).toBeTypeOf( 'function' );
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
		vi.mocked( getWebpackConfigServer ).mockReturnValue( webpackConfig );

		// Webpack returns a compiler instance if callback is not specified.
		vi.mocked( webpack ).mockReturnValue( compiler );

		// Execute the task.
		startTask( taskOptions );

		// Verify arguments passed to webpack-dev-server.
		expect( WebpackDevServer ).toHaveBeenCalledTimes( 1 );
		expect( WebpackDevServer ).toHaveBeenCalledWith(
			{
				port: 9000,
				open: true
			},
			compiler
		);

		// Verify whether the server was started.
		expect( vi.mocked( WebpackDevServer ).mock.instances[ 0 ].start ).toHaveBeenCalledTimes( 1 );
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
		vi.mocked( getWebpackConfigServer ).mockReturnValue( webpackConfig );

		// Webpack returns a compiler instance if callback is not specified.
		vi.mocked( webpack ).mockReturnValue( compiler );

		// Execute the task.
		startTask( taskOptions );

		// Verify arguments passed to webpack-dev-server.
		expect( WebpackDevServer ).toHaveBeenCalledTimes( 1 );
		expect( WebpackDevServer ).toHaveBeenCalledWith(
			{
				port: 9000,
				open: false
			},
			compiler
		);
	} );
} );

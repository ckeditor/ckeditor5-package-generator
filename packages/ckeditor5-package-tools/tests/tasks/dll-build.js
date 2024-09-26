/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi } from 'vitest';
import webpack from 'webpack';
import getWebpackConfigDll from '../../lib/utils/get-webpack-config-dll.js';
import dllBuild from '../../lib/tasks/dll-build.js';

vi.mock( 'webpack' );
vi.mock( '../../lib/utils/get-webpack-config-dll.js' );

describe( 'lib/tasks/dll-build', () => {
	it( 'should be a function', () => {
		expect( dllBuild ).toBeTypeOf( 'function' );
	} );

	it( 'resolves a promise after building a file', async () => {
		vi.spyOn( console, 'log' ).mockImplementation( () => {} );

		const taskOptions = {
			cwd: '/cwd'
		};

		const webpackConfig = {
			mode: 'production',
			entry: 'index.js'
		};

		// Mock reading the configuration.
		vi.mocked( getWebpackConfigDll ).mockReturnValue( webpackConfig );

		// Execute the task.
		const taskPromise = dllBuild( taskOptions );

		expect( webpack ).toHaveBeenCalledTimes( 1 );
		expect( webpack ).toHaveBeenCalledWith( webpackConfig, expect.any( Function ) );

		const [ , doneCallback ] = webpack.mock.calls[ 0 ];
		doneCallback( null, {
			hasErrors() {
				return false;
			},
			toString() {
				return 'Compilation stats.';
			}
		} );

		await taskPromise;

		expect( console.log ).toHaveBeenCalledTimes( 1 );
		expect( console.log ).toHaveBeenCalledWith( 'Compilation stats.' );
	} );

	it( 'rejects if webpack returned an error', async () => {
		const taskOptions = {
			cwd: '/cwd'
		};

		const error = new Error( 'Unexpected error.' );

		// Mock reading the configuration.
		vi.mocked( getWebpackConfigDll ).mockReturnValue( {} );

		// Execute the task.
		const taskPromise = dllBuild( taskOptions );

		expect( webpack ).toHaveBeenCalledTimes( 1 );

		const [ , doneCallback ] = webpack.mock.calls[ 0 ];

		doneCallback( error, {} );

		return taskPromise.then(
			() => {
				throw new Error( 'Expected to be rejected.' );
			},
			err => {
				expect( err ).toEqual( error );
			}
		);
	} );

	it( 'rejects if webpack completed a build with an error', async () => {
		const taskOptions = {
			cwd: '/cwd'
		};

		// Mock reading the configuration.
		vi.mocked( getWebpackConfigDll ).mockReturnValue( {} );

		// Execute the task.
		const taskPromise = dllBuild( taskOptions );

		expect( webpack ).toHaveBeenCalledTimes( 1 );

		const [ , doneCallback ] = webpack.mock.calls[ 0 ];

		doneCallback( null, {
			hasErrors() {
				return true;
			},
			toString() {
				return 'Unexpected error.';
			}
		} );

		return taskPromise.then(
			() => {
				throw new Error( 'Expected to be rejected.' );
			},
			err => {
				expect( err.message ).toEqual( 'Unexpected error.' );
			}
		);
	} );
} );

/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { spawn } from 'child_process';
import { tools } from '@ckeditor/ckeditor5-dev-utils';
import installDependencies from '../../lib/utils/install-dependencies.js';

vi.mock( 'chalk', () => ( {
	default: {
		gray: {
			italic: vi.fn( str => str )
		}
	}
} ) );
vi.mock( 'child_process' );
vi.mock( '@ckeditor/ckeditor5-dev-utils' );

describe( 'lib/utils/install-dependencies', () => {
	let defaultDirectoryPath, stubs;

	beforeEach( () => {
		defaultDirectoryPath = 'directory/path/foo';

		stubs = {
			spinner: {
				start: vi.fn(),
				finish: vi.fn()
			},
			installTask: {
				on: vi.fn()
			}
		};

		vi.mocked( tools.createSpinner ).mockReturnValue( stubs.spinner );
		vi.mocked( spawn ).mockReturnValue( stubs.installTask );
	} );

	it( 'should be a function', () => {
		expect( installDependencies ).toBeTypeOf( 'function' );
	} );

	it( 'creates and removes the spinner', async () => {
		await runTest( {} );

		expect( stubs.spinner.start ).toHaveBeenCalledTimes( 1 );
		expect( stubs.spinner.finish ).toHaveBeenCalledTimes( 1 );

		expect( tools.createSpinner ).toHaveBeenCalledTimes( 1 );
		expect( tools.createSpinner ).toHaveBeenCalledWith( 'Installing dependencies... It takes a while.', { isDisabled: false } );
	} );

	it( 'installs dependencies using yarn', async () => {
		await runTest( {} );

		expect( spawn ).toHaveBeenCalledTimes( 1 );
		expect( spawn ).toHaveBeenCalledWith(
			'yarnpkg',
			[],
			{
				encoding: 'utf8',
				shell: true,
				cwd: defaultDirectoryPath,
				stderr: 'inherit'
			}
		);
	} );

	it( 'installs dependencies using yarn in verbose mode', async () => {
		await runTest( { verbose: true } );

		expect( spawn ).toHaveBeenCalledTimes( 1 );
		expect( spawn ).toHaveBeenCalledWith(
			'yarnpkg',
			[],
			{
				encoding: 'utf8',
				shell: true,
				cwd: defaultDirectoryPath,
				stderr: 'inherit',
				stdio: 'inherit'
			}
		);
	} );

	it( 'installs dependencies using npm', async () => {
		await runTest( { packageManager: 'npm' } );

		expect( spawn ).toHaveBeenCalledTimes( 1 );
		expect( spawn ).toHaveBeenCalledWith(
			'npm',
			[ 'install' ],
			{
				encoding: 'utf8',
				shell: true,
				cwd: defaultDirectoryPath,
				stderr: 'inherit'
			}
		);
	} );

	it( 'installs dependencies using npm in verbose mode', async () => {
		await runTest( { packageManager: 'npm', verbose: true } );

		expect( spawn ).toHaveBeenCalledTimes( 1 );
		expect( spawn ).toHaveBeenCalledWith(
			'npm',
			[ 'install' ],
			{
				encoding: 'utf8',
				shell: true,
				cwd: defaultDirectoryPath,
				stderr: 'inherit',
				stdio: 'inherit'
			}
		);
	} );

	it( 'uses --install-links flag using npm in dev mode', async () => {
		await runTest( { packageManager: 'npm', verbose: true, dev: true } );

		expect( spawn ).toHaveBeenCalledWith(
			'npm',
			[ 'install', '--install-links' ],
			expect.any( Object )
		);
	} );

	it( 'installs dependencies using pnpm', async () => {
		await runTest( { packageManager: 'pnpm' } );

		expect( spawn ).toHaveBeenCalledTimes( 1 );
		expect( spawn ).toHaveBeenCalledWith(
			'pnpm',
			[ 'install' ],
			{
				encoding: 'utf8',
				shell: true,
				cwd: defaultDirectoryPath,
				stderr: 'inherit'
			}
		);
	} );

	it( 'installs dependencies using pnpm in verbose mode', async () => {
		await runTest( { packageManager: 'pnpm', verbose: true } );

		expect( spawn ).toHaveBeenCalledTimes( 1 );
		expect( spawn ).toHaveBeenCalledWith(
			'pnpm',
			[ 'install' ],
			{
				encoding: 'utf8',
				shell: true,
				cwd: defaultDirectoryPath,
				stderr: 'inherit',
				stdio: 'inherit'
			}
		);
	} );

	it( 'installs dependencies using pnpm in dev mode', async () => {
		await runTest( { packageManager: 'pnpm', dev: true } );

		expect( spawn ).toHaveBeenCalledWith(
			'pnpm',
			[ 'install' ],
			expect.any( Object )
		);
	} );

	it( 'throws an error when install task closes with error exit code', () => {
		return runTest( { exitCode: 1 } )
			.then( () => {
				throw new Error( 'Expected to throw.' );
			} )
			.catch( err => {
				expect( err.message ).toEqual( 'Installing dependencies finished with an error.' );
			} );
	} );

	it( 'throws an error for unhandled package manager', async () => {
		try {
			await installDependencies( defaultDirectoryPath, 'unknown', false, false );
			throw new Error( 'Expected to throw.' );
		} catch ( err ) {
			expect( err.message ).toEqual( 'Unhandled package manager unknown' );
		}
	} );

	/**
	 * This function allows execution of following code block:
	 *
	 * installTask.on( 'close', exitCode => {
	 *
	 * It is needed to run the test properly, as that block
	 * is a callback that executes resolve() and reject().
	 *
	 * @param {Object} options
	 */
	async function runTest( { packageManager = 'yarn', exitCode = 0, verbose = false, dev = false } ) {
		const promise = installDependencies( defaultDirectoryPath, packageManager, verbose, dev );
		const [ , installTaskCloseCallback ] = stubs.installTask.on.mock.calls[ 0 ];
		await installTaskCloseCallback( exitCode );

		return promise;
	}
} );

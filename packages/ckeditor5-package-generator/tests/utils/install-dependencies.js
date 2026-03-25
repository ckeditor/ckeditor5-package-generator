/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { spawn } from 'node:child_process';
import { createSpinner } from '../../lib/utils/prompt.js';
import installDependencies from '../../lib/utils/install-dependencies.js';

vi.mock( 'child_process' );
vi.mock( '../../lib/utils/prompt.js' );

describe( 'lib/utils/install-dependencies', () => {
	let defaultDirectoryPath, stubs;

	beforeEach( () => {
		defaultDirectoryPath = 'directory/path/foo';

		stubs = {
			spinner: {
				start: vi.fn(),
				stop: vi.fn()
			},
			installTask: {
				on: vi.fn()
			}
		};

		vi.mocked( createSpinner ).mockReturnValue( stubs.spinner );
		vi.mocked( spawn ).mockReturnValue( stubs.installTask );
	} );

	it( 'should be a function', () => {
		expect( installDependencies ).toBeTypeOf( 'function' );
	} );

	it( 'shows a clack spinner during installation', async () => {
		await runTest( {} );

		expect( createSpinner ).toHaveBeenCalledTimes( 1 );
		expect( stubs.spinner.start ).toHaveBeenCalledTimes( 1 );
		expect( stubs.spinner.start ).toHaveBeenCalledWith( 'Installing dependencies' );
		expect( stubs.spinner.stop ).toHaveBeenCalledTimes( 1 );
		expect( stubs.spinner.stop ).toHaveBeenCalledWith( 'Dependencies installed.' );
	} );

	it( 'does not create a spinner in verbose mode', async () => {
		await runTest( { verbose: true } );

		expect( createSpinner ).not.toHaveBeenCalled();
		expect( stubs.spinner.start ).not.toHaveBeenCalled();
		expect( stubs.spinner.stop ).not.toHaveBeenCalled();
	} );

	it( 'installs dependencies using yarn', async () => {
		await runTest( {} );

		expect( spawn ).toHaveBeenCalledTimes( 1 );
		expect( spawn ).toHaveBeenCalledWith(
			'yarnpkg install',
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
			'yarnpkg install',
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
			'npm install',
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
			'npm install',
			{
				encoding: 'utf8',
				shell: true,
				cwd: defaultDirectoryPath,
				stderr: 'inherit',
				stdio: 'inherit'
			}
		);
	} );

	it( 'installs dependencies using pnpm', async () => {
		await runTest( { packageManager: 'pnpm' } );

		expect( spawn ).toHaveBeenCalledTimes( 1 );
		expect( spawn ).toHaveBeenCalledWith(
			'pnpm install',
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
			'pnpm install',
			{
				encoding: 'utf8',
				shell: true,
				cwd: defaultDirectoryPath,
				stderr: 'inherit',
				stdio: 'inherit'
			}
		);
	} );

	it( 'shows spinner error when installation fails', () => {
		return runTest( { exitCode: 1 } )
			.then( () => {
				throw new Error( 'Expected to throw.' );
			} )
			.catch( err => {
				expect( err.message ).toEqual( 'Installing dependencies finished with an error.' );
				expect( stubs.spinner.stop ).toHaveBeenCalledTimes( 1 );
				expect( stubs.spinner.stop ).toHaveBeenCalledWith( 'Installing dependencies failed.', 1 );
			} );
	} );

	it( 'shows spinner error for unhandled package manager', async () => {
		await expect( installDependencies( defaultDirectoryPath, 'unknown', false ) ).rejects.toThrow(
			'Unknown package manager: unknown.'
		);

		expect( stubs.spinner.stop ).toHaveBeenCalledTimes( 1 );
		expect( stubs.spinner.stop ).toHaveBeenCalledWith( 'Installing dependencies failed.', 1 );
	} );

	/**
	 * @param {Object} options
	 */
	async function runTest( { packageManager = 'yarn', exitCode = 0, verbose = false } ) {
		const promise = installDependencies( defaultDirectoryPath, packageManager, verbose );
		const [ , installTaskCloseCallback ] = stubs.installTask.on.mock.calls[ 0 ];
		await installTaskCloseCallback( exitCode );

		return promise;
	}
} );

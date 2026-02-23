/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { spawn } from 'node:child_process';
import installGitHooks from '../../lib/utils/install-git-hooks.js';

vi.mock( 'child_process' );

describe( 'lib/utils/install-git-hooks', () => {
	let defaultDirectoryPath, stubs;

	beforeEach( () => {
		defaultDirectoryPath = 'directory/path/foo';

		stubs = {
			logger: {
				process: vi.fn()
			},
			rebuildTask: {
				on: vi.fn()
			}
		};

		vi.mocked( spawn ).mockReturnValue( stubs.rebuildTask );
	} );

	it( 'should be a function', () => {
		expect( installGitHooks ).toBeTypeOf( 'function' );
	} );

	it( 'logs the process', async () => {
		await runTest( {} );

		expect( stubs.logger.process ).toHaveBeenCalledTimes( 1 );
		expect( stubs.logger.process ).toHaveBeenCalledWith( 'Installing Git hooks...' );
	} );

	it( 'installs git hooks', async () => {
		await runTest( {} );

		expect( spawn ).toHaveBeenCalledTimes( 1 );
		expect( spawn ).toHaveBeenCalledWith(
			'npm rebuild husky',
			{
				encoding: 'utf8',
				shell: true,
				cwd: defaultDirectoryPath,
				stderr: 'inherit'
			}
		);
	} );

	it( 'installs git hooks in verbose mode', async () => {
		await runTest( { verbose: true } );

		expect( spawn ).toHaveBeenCalledTimes( 1 );
		expect( spawn ).toHaveBeenCalledWith(
			'npm rebuild husky',
			{
				encoding: 'utf8',
				shell: true,
				cwd: defaultDirectoryPath,
				stderr: 'inherit',
				stdio: 'inherit'
			}
		);
	} );

	it( 'throws an error when install task closes with error exit code', () => {
		return runTest( { exitCode: 1 } )
			.then( () => {
				throw new Error( 'Expected to throw.' );
			} )
			.catch( err => {
				expect( err.message ).toEqual( 'Rebuilding finished with an error.' );
			} );
	} );

	/**
	 * This function allows execution of following code block:
	 *
	 * rebuildTask.on( 'close', exitCode => {
	 *
	 * It is needed to run the test properly, as that block
	 * is a callback that executes resolve() and reject().
	 *
	 * @param {Object} options
	 */
	async function runTest( { verbose = false, exitCode = 0 } ) {
		const promise = installGitHooks( defaultDirectoryPath, stubs.logger, verbose );
		const [ , rebuildTaskCloseCallback ] = stubs.rebuildTask.on.mock.calls[ 0 ];
		await rebuildTaskCloseCallback( exitCode );

		return promise;
	}
} );

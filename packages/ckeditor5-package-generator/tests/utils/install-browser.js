/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { spawn } from 'node:child_process';
import { createSpinner, showNote } from '../../lib/utils/prompt.js';
import installBrowser from '../../lib/utils/install-browser.js';

vi.mock( 'child_process' );
vi.mock( '../../lib/utils/prompt.js' );

describe( 'lib/utils/install-browser', () => {
	let defaultDirectoryPath, stubs, originalPlatform;

	beforeEach( () => {
		defaultDirectoryPath = 'directory/path/foo';
		originalPlatform = process.platform;

		stubs = {
			spinner: {
				start: vi.fn(),
				stop: vi.fn(),
				error: vi.fn()
			},
			installTask: {
				on: vi.fn()
			}
		};

		vi.mocked( createSpinner ).mockReturnValue( stubs.spinner );
		vi.mocked( spawn ).mockReturnValue( stubs.installTask );
	} );

	afterEach( () => {
		setPlatform( originalPlatform );
	} );

	it( 'should be a function', () => {
		expect( installBrowser ).toBeTypeOf( 'function' );
	} );

	it( 'shows a clack spinner during installation', async () => {
		await runTest( {} );

		expect( createSpinner ).toHaveBeenCalledTimes( 1 );
		expect( stubs.spinner.start ).toHaveBeenCalledWith( 'Installing Chromium for tests' );
		expect( stubs.spinner.stop ).toHaveBeenCalledWith( 'Chromium installed.' );
		expect( stubs.spinner.error ).not.toHaveBeenCalled();
		expect( showNote ).not.toHaveBeenCalled();
	} );

	it( 'does not create a spinner in verbose mode', async () => {
		await runTest( { verbose: true } );

		expect( createSpinner ).not.toHaveBeenCalled();
	} );

	it.each( [
		[ 'npm', 'npx playwright install chromium' ],
		[ 'yarn', 'yarnpkg playwright install chromium' ],
		[ 'pnpm', 'pnpm exec playwright install chromium' ]
	] )( 'installs Chromium using %s', async ( packageManager, command ) => {
		await runTest( { packageManager } );

		expect( spawn ).toHaveBeenCalledTimes( 1 );
		expect( spawn ).toHaveBeenCalledWith( command, {
			encoding: 'utf8',
			shell: true,
			cwd: defaultDirectoryPath,
			stderr: 'inherit'
		} );
	} );

	it( 'passes the output to the terminal in verbose mode', async () => {
		await runTest( { verbose: true } );

		expect( spawn ).toHaveBeenCalledWith( 'npx playwright install chromium', {
			encoding: 'utf8',
			shell: true,
			cwd: defaultDirectoryPath,
			stderr: 'inherit',
			stdio: 'inherit'
		} );
	} );

	it( 'throws for an unknown package manager', async () => {
		await expect( installBrowser( defaultDirectoryPath, 'unknown', false ) ).rejects.toThrow(
			'Unknown package manager: unknown.'
		);

		expect( spawn ).not.toHaveBeenCalled();
	} );

	it.each( [
		[ 'npm', 'npx' ],
		[ 'yarn', 'yarn' ],
		[ 'pnpm', 'pnpm exec' ]
	] )( 'does not throw and suggests install-deps on Linux when installation with %s fails', async ( packageManager, exec ) => {
		setPlatform( 'linux' );

		await runTest( { packageManager, exitCode: 1 } );

		expect( stubs.spinner.error ).toHaveBeenCalledWith( 'Installing Chromium failed.' );
		expect( stubs.spinner.stop ).not.toHaveBeenCalled();
		expect( showNote ).toHaveBeenCalledTimes( 1 );

		const [ message, title ] = vi.mocked( showNote ).mock.calls[ 0 ];

		expect( title ).toEqual( 'Installing Chromium failed' );
		expect( message ).toContain( `${ exec } playwright install-deps chromium\n${ exec } playwright install chromium` );
	} );

	it.each( [ 'darwin', 'win32' ] )( 'suggests only re-running the download on %s', async platform => {
		setPlatform( platform );

		await runTest( { exitCode: 1 } );

		const [ message ] = vi.mocked( showNote ).mock.calls[ 0 ];

		expect( message ).toContain( 'npx playwright install chromium' );
		expect( message ).not.toContain( 'install-deps' );
	} );

	it( 'treats a command terminated by a signal as a failure', async () => {
		const promise = installBrowser( defaultDirectoryPath, 'npm', false );
		const closeCallback = stubs.installTask.on.mock.calls.find( ( [ event ] ) => event === 'close' )[ 1 ];

		closeCallback( null, 'SIGTERM' );
		await promise;

		expect( stubs.spinner.stop ).not.toHaveBeenCalled();
		expect( stubs.spinner.error ).toHaveBeenCalledWith( 'Installing Chromium failed.' );
		expect( showNote ).toHaveBeenCalledTimes( 1 );
	} );

	it( 'treats a command that cannot be started as a failure', async () => {
		const promise = installBrowser( defaultDirectoryPath, 'npm', false );
		const errorCallback = stubs.installTask.on.mock.calls.find( ( [ event ] ) => event === 'error' )[ 1 ];

		errorCallback( new Error( 'spawn failed' ) );
		await promise;

		expect( stubs.spinner.error ).toHaveBeenCalledWith( 'Installing Chromium failed.' );
		expect( showNote ).toHaveBeenCalledTimes( 1 );
	} );

	/**
	 * @param {Object} options
	 */
	async function runTest( { packageManager = 'npm', exitCode = 0, verbose = false } ) {
		const promise = installBrowser( defaultDirectoryPath, packageManager, verbose );
		const closeCallback = stubs.installTask.on.mock.calls.find( ( [ event ] ) => event === 'close' )[ 1 ];

		closeCallback( exitCode );

		return promise;
	}

	/**
	 * @param {String} platform
	 */
	function setPlatform( platform ) {
		Object.defineProperty( process, 'platform', { value: platform, configurable: true } );
	}
} );

/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as childProcess from 'node:child_process';
import getPackageVersion from '../../lib/utils/get-package-version.js';

vi.mock( 'node:child_process', () => ( {
	exec: vi.fn()
} ) );

describe( 'lib/utils/get-package-version', () => {
	beforeEach( () => {
		vi.mocked( childProcess.exec ).mockImplementation( ( command, options, callback ) => {
			callback( null, { stdout: '"30.0.0"', stderr: '' } );
		} );
	} );

	it( 'should be a function', () => {
		expect( getPackageVersion ).toBeTypeOf( 'function' );
	} );

	it( 'returns a string', async () => {
		const returnedValue = await getPackageVersion( 'ckeditor5' );

		expect( returnedValue ).toBeTypeOf( 'string' );
	} );

	it( 'calls npm registry to determine the version', async () => {
		await getPackageVersion( 'ckeditor5' );

		expect( childProcess.exec ).toHaveBeenCalledTimes( 1 );
		expect( childProcess.exec ).toHaveBeenCalledWith(
			'npm view "ckeditor5" version --json',
			{ encoding: 'utf-8' },
			expect.any( Function )
		);
	} );

	it( 'supports scoped package names', async () => {
		await getPackageVersion( '@ckeditor/ckeditor5-inspector' );

		expect( childProcess.exec ).toHaveBeenCalledTimes( 1 );
		expect( childProcess.exec ).toHaveBeenCalledWith(
			'npm view "@ckeditor/ckeditor5-inspector" version --json',
			{ encoding: 'utf-8' },
			expect.any( Function )
		);
	} );

	it( 'returns a version matching semantic versioning specification', async () => {
		const returnedValue = await getPackageVersion( 'ckeditor5' );

		expect( returnedValue ).toEqual( '30.0.0' );
	} );

	it( 'narrows the resolved version down to the provided semver range', async () => {
		await getPackageVersion( 'eslint-config-ckeditor5', '^20.0.0' );

		expect( childProcess.exec ).toHaveBeenCalledTimes( 1 );
		expect( childProcess.exec ).toHaveBeenCalledWith(
			'npm view "eslint-config-ckeditor5@^20.0.0" version --json',
			{ encoding: 'utf-8' },
			expect.any( Function )
		);
	} );

	it( 'wraps the package identifier in quotes, as cmd.exe on Windows removes an unquoted caret', async () => {
		await getPackageVersion( '@ckeditor/ckeditor5-dev-build-tools', '^61.0.0' );

		expect( childProcess.exec ).toHaveBeenCalledWith(
			'npm view "@ckeditor/ckeditor5-dev-build-tools@^61.0.0" version --json',
			{ encoding: 'utf-8' },
			expect.any( Function )
		);
	} );

	it( 'returns the highest version when the range matches multiple versions', async () => {
		vi.mocked( childProcess.exec ).mockImplementation( ( command, options, callback ) => {
			callback( null, { stdout: '[ "20.0.0", "20.1.0", "20.1.1" ]', stderr: '' } );
		} );

		const returnedValue = await getPackageVersion( 'eslint-config-ckeditor5', '^20.0.0' );

		expect( returnedValue ).toEqual( '20.1.1' );
	} );

	it( 'returns the highest version even if npm does not list the versions in the ascending order', async () => {
		// npm uses this order after a patch release to an older minor line.
		vi.mocked( childProcess.exec ).mockImplementation( ( command, options, callback ) => {
			callback( null, { stdout: '[ "20.0.0", "20.2.0", "20.1.1" ]', stderr: '' } );
		} );

		const returnedValue = await getPackageVersion( 'eslint-config-ckeditor5', '^20.0.0' );

		expect( returnedValue ).toEqual( '20.2.0' );
	} );
} );

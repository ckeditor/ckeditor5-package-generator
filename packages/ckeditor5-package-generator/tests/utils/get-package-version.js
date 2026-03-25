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
			callback( null, { stdout: '30.0.0', stderr: '' } );
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
			'npm view ckeditor5 version',
			{ encoding: 'utf-8' },
			expect.any( Function )
		);
	} );

	it( 'supports scoped package names', async () => {
		await getPackageVersion( '@ckeditor/ckeditor5-inspector' );

		expect( childProcess.exec ).toHaveBeenCalledTimes( 1 );
		expect( childProcess.exec ).toHaveBeenCalledWith(
			'npm view @ckeditor/ckeditor5-inspector version',
			{ encoding: 'utf-8' },
			expect.any( Function )
		);
	} );

	it( 'returns a version matching semantic versioning specification', async () => {
		const returnedValue = await getPackageVersion( 'ckeditor5' );

		expect( returnedValue ).toEqual( '30.0.0' );
	} );
} );

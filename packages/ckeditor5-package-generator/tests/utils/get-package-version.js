/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { execFileSync } from 'node:child_process';
import getPackageVersion from '../../lib/utils/get-package-version.js';

vi.mock( 'child_process' );

describe( 'lib/utils/get-package-version', () => {
	beforeEach( () => {
		vi.mocked( execFileSync ).mockReturnValue( '30.0.0' );
	} );

	it( 'should be a function', () => {
		expect( getPackageVersion ).toBeTypeOf( 'function' );
	} );

	it( 'returns a string', () => {
		const returnedValue = getPackageVersion( 'ckeditor5', 'npm' );

		expect( returnedValue ).toBeTypeOf( 'string' );
	} );

	it( 'calls "npm show" to determine the version', () => {
		getPackageVersion( 'ckeditor5', 'npm' );

		expect( execFileSync ).toHaveBeenCalledTimes( 1 );
		expect( execFileSync ).toHaveBeenCalledWith(
			'npm',
			[ 'view', 'ckeditor5', 'version' ],
			{ encoding: 'utf-8', stdio: 'pipe' }
		);
	} );

	it( 'returns a version matching semantic versioning specification', () => {
		const returnedValue = getPackageVersion( 'ckeditor5', 'npm' );

		expect( returnedValue ).toEqual( '30.0.0' );
	} );
} );

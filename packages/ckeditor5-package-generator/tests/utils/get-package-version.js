/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { execSync } from 'node:child_process';
import getPackageVersion from '../../lib/utils/get-package-version.js';

vi.mock( 'node:child_process' );

describe( 'lib/utils/get-package-version', () => {
	beforeEach( () => {
		vi.mocked( execSync ).mockReturnValue( '"30.0.0"\n' );
	} );

	it( 'should be a function', () => {
		expect( getPackageVersion ).toBeTypeOf( 'function' );
	} );

	it( 'returns a string', () => {
		const returnedValue = getPackageVersion( 'ckeditor5' );

		expect( returnedValue ).toBeTypeOf( 'string' );
	} );

	it( 'calls npm view with json output to determine the version', () => {
		getPackageVersion( 'ckeditor5' );

		expect( execSync ).toHaveBeenCalledTimes( 1 );
		expect( execSync ).toHaveBeenCalledWith( 'npm view "ckeditor5" version --json', {
			encoding: 'utf8'
		} );
	} );

	it( 'returns a version matching semantic versioning specification', () => {
		const returnedValue = getPackageVersion( 'ckeditor5' );

		expect( returnedValue ).toEqual( '30.0.0' );
	} );

	it( 'passes the semver range to npm view when provided', () => {
		getPackageVersion( 'ckeditor5', '^47.0.0' );

		expect( execSync ).toHaveBeenCalledWith( 'npm view "ckeditor5@^47.0.0" version --json', {
			encoding: 'utf8'
		} );
	} );

	it( 'returns the highest version matching the provided range', () => {
		vi.mocked( execSync ).mockReturnValue( '["46.1.0","47.0.0","47.2.1","48.0.0"]\n' );

		expect( getPackageVersion( 'ckeditor5', '^47.0.0' ) ).toEqual( '47.2.1' );
	} );

	it( 'throws when no returned version matches the provided range', () => {
		vi.mocked( execSync ).mockReturnValue( '["46.1.0","48.0.0"]\n' );

		expect( () => getPackageVersion( 'ckeditor5', '^47.0.0' ) ).toThrow( 'No version of ckeditor5 matches ^47.0.0' );
	} );
} );

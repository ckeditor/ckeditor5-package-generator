/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { execSync } from 'node:child_process';
import isPnpmInstalled from '../../lib/utils/is-pnpm-installed.js';

vi.mock( 'child_process' );

describe( 'lib/utils/is-pnpm-installed', () => {
	beforeEach( () => {
		vi.clearAllMocks();
	} );

	it( 'should return true when pnpm is installed', () => {
		vi.mocked( execSync ).mockReturnValue( Buffer.from( '8.15.0' ) );

		const result = isPnpmInstalled();

		expect( result ).toEqual( true );
		expect( execSync ).toHaveBeenCalledWith( 'pnpm -v || echo false', { stdio: [ null, 'pipe', null ] } );
	} );

	it( 'should return false when pnpm is not installed', () => {
		vi.mocked( execSync ).mockReturnValue( Buffer.from( 'false' ) );

		const result = isPnpmInstalled();

		expect( result ).toEqual( false );
		expect( execSync ).toHaveBeenCalledWith( 'pnpm -v || echo false', { stdio: [ null, 'pipe', null ] } );
	} );
} );

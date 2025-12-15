/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi } from 'vitest';
import { execSync } from 'node:child_process';
import isYarnInstalled from '../../lib/utils/is-yarn-installed.js';

vi.mock( 'child_process' );

describe( 'lib/utils/is-yarn-installed', () => {
	it( 'should return true when yarn is installed', () => {
		execSync.mockReturnValue( '1.23.45' );

		expect( isYarnInstalled() ).toEqual( true );
	} );

	it( 'should return false when yarn is not installed', () => {
		execSync.mockReturnValue( 'false' );

		expect( isYarnInstalled() ).toEqual( false );
	} );
} );

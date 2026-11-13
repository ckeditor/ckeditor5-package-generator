/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect } from 'vitest';
import SUPPORTED_PACKAGE_MANAGERS from '../../lib/utils/supported-package-managers.js';

describe( 'lib/utils/supported-package-managers', () => {
	it( 'should contain npm and pnpm', () => {
		expect( SUPPORTED_PACKAGE_MANAGERS ).toEqual( [ 'npm', 'pnpm' ] );
	} );
} );

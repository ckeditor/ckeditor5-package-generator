/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi } from 'vitest';
import updateEntryPoint from '../../lib/utils/update-entry-point.js';
import exportPackageAsJavaScript from '../../lib/tasks/export-package-as-javascript.js';

vi.mock( '../../lib/utils/update-entry-point.js' );

describe( 'lib/tasks/export-package-as-javascript', () => {
	it( 'should be a function', () => {
		expect( exportPackageAsJavaScript ).toBeTypeOf( 'function' );
	} );

	it( 'should call updateEntryPoint() with correct arguments', () => {
		const options = { foo: 'bar' };

		exportPackageAsJavaScript( options );

		expect( updateEntryPoint ).toHaveBeenCalledTimes( 1 );
		expect( updateEntryPoint ).toHaveBeenCalledWith( options, 'js' );
	} );
} );

/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi } from 'vitest';
import synchronizeTranslations from '../lib/tasks/synchronize-translations.js';
import tasks from '../lib/index.js';

vi.mock( '../lib/tasks/synchronize-translations.js' );

describe( 'lib/index', () => {
	it( 'should be an object containing available tasks', () => {
		expect( tasks ).toBeTypeOf( 'object' );
	} );

	describe( '#translations:synchronize', () => {
		it( 'is available', () => {
			expect( tasks[ 'translations:synchronize' ] ).toBeTypeOf( 'function' );
		} );

		it( 'executes the proper function from the "tasks/" directory', () => {
			tasks[ 'translations:synchronize' ]();

			expect( synchronizeTranslations ).toBeCalledTimes( 1 );
		} );

		it( 'passes arguments directly to the function', () => {
			const options = { foo: 1, bar: true };
			tasks[ 'translations:synchronize' ]( options );

			expect( synchronizeTranslations ).toHaveBeenCalledWith( options );
		} );
	} );
} );

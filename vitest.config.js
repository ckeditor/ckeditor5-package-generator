/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { defineConfig } from 'vitest/config';

export default defineConfig( {
	test: {
		testTimeout: 10000,
		mockReset: true,
		restoreMocks: true,
		include: [
			'packages/*/tests/**'
		],
		coverage: {
			provider: 'v8',
			include: [
				'packages/*/lib/**'
			],
			exclude: [
				'templates'
			],
			reporter: [ 'text', 'json', 'html', 'lcov' ]
		}
	}
} );

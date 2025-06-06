#!/usr/bin/env node

/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/*

Usage:
node scripts/bump-year.js

And after reviewing the changes:
git commit -am "Internal: Bumped the year." && git push

*/

import { bumpYear } from '@ckeditor/ckeditor5-dev-bump-year';

bumpYear( {
	cwd: process.cwd(),
	globPatterns: [
		{ // LICENSE.md, .eslintrc.js, etc.
			pattern: '*',
			options: {
				dot: true
			}
		},
		{
			pattern: '.husky/*'
		},
		{
			pattern: '!(coverage|.nyc_output)/**',
			options: {
				ignore: [
					'**/templates/**'
				]
			}
		}
	],
	initialYear: '2020'
} );

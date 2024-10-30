#!/usr/bin/env node

/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { generateChangelogForMonoRepository } from '@ckeditor/ckeditor5-dev-release-tools';
import parseArguments from './utils/parsearguments.js';

const cliArguments = parseArguments( process.argv.slice( 2 ) );

generateChangelogForMonoRepository( {
	cwd: process.cwd(),
	packages: 'packages',
	releaseBranch: cliArguments.branch,
	transformScope: name => {
		if ( name === 'generator' ) {
			return 'https://www.npmjs.com/package/ckeditor5-package-generator';
		}

		return 'https://www.npmjs.com/package/@ckeditor/ckeditor5-package-' + name;
	}
} );

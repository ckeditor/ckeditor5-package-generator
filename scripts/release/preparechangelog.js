#!/usr/bin/env node

/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { generateChangelogForMonoRepository } from '@ckeditor/ckeditor5-dev-changelog';
import { PACKAGE_GENERATOR_ROOT, PACKAGES_DIRECTORY } from './utils/constants.js';
import parseArguments from './utils/parsearguments.js';

const cliOptions = parseArguments( process.argv.slice( 2 ) );

const changelogOptions = {
	cwd: PACKAGE_GENERATOR_ROOT,
	packagesDirectory: PACKAGES_DIRECTORY,
	disableFilesystemOperations: cliOptions.dryRun,
	shouldIgnoreRootPackage: true,
	npmPackageToCheck: 'ckeditor5-package-generator',
	transformScope: name => {
		const displayName = name.split( 'ckeditor5-package-' ).pop();

		const npmUrl = name === 'ckeditor5-package-generator' ?
			'https://www.npmjs.com/package/ckeditor5-package-generator' :
			'https://www.npmjs.com/package/@ckeditor/' + name;

		return {
			displayName,
			npmUrl
		};
	}
};

if ( cliOptions.date ) {
	changelogOptions.date = cliOptions.date;
}

generateChangelogForMonoRepository( changelogOptions )
	.then( maybeChangelog => {
		if ( maybeChangelog ) {
			console.log( maybeChangelog );
		}
	} );

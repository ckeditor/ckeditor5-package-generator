/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { globSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';
import { join, relative, dirname } from 'node:path';
import { synchronizeTranslations } from '@ckeditor/ckeditor5-dev-translations';

const args = parseArgs( {
	options: {
		'validate-only': { type: 'boolean', default: false }
	}
} );

const cwd = process.cwd();

// Glob handles posix paths.
const sourceFilesGlob = join( cwd, 'src', '**', '*.[jt]s' );

synchronizeTranslations( {
	// An array containing absolute paths the package sources.
	sourceFiles: globSync( sourceFilesGlob ),

	// An absolute path to the package.
	packagePaths: [ cwd ],

	// A relative path to the `@ckeditor/ckeditor5-core` package where common translations are located.
	corePackagePath: getCorePackagePath( cwd ),

	// Ignore unused from the core package, as the shared context may but does not have to be used.
	ignoreUnusedCorePackageContexts: true,

	// Whether to validate the translations contexts against the source messages only. No files will be updated.
	validateOnly: args.values[ 'validate-only' ],

	// Skip the license header.
	skipLicenseHeader: true
} );

/**
 * Returns the relative path to the `@ckeditor/ckeditor5-core` package.
 */
function getCorePackagePath( cwd ) {
	const corePackagePath = dirname(
		fileURLToPath( import.meta.resolve( '@ckeditor/ckeditor5-core/package.json' ) )
	);

	return relative( cwd, corePackagePath );
}

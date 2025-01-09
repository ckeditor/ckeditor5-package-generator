/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import path from 'path';
import glob from 'glob';
import { synchronizeTranslations } from '@ckeditor/ckeditor5-dev-translations';

export default options => {
	// Glob handles posix paths.
	const sourceFilesGlob = path.join( options.cwd, 'src', '**', '*.[jt]s' ).split( /[\\/]/g ).join( '/' );

	return synchronizeTranslations( {
		// An array containing absolute paths the package sources.
		sourceFiles: glob.sync( sourceFilesGlob ),

		// An absolute path to the package.
		packagePaths: [ options.cwd ],

		// A relative path to the `@ckeditor/ckeditor5-core` package where common translations are located.
		corePackagePath: path.join( 'node_modules', '@ckeditor', 'ckeditor5-core' ),

		// Ignore unused from the core package, as the shared context may but does not have to be used.
		ignoreUnusedCorePackageContexts: true,

		// Whether to validate the translations contexts against the source messages only. No files will be updated.
		validateOnly: options.validateOnly,

		// Skip the license header.
		skipLicenseHeader: true
	} );
};

/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* eslint-env node */

import upath from 'upath';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath( import.meta.url );
const __dirname = upath.dirname( __filename );

const ROOT_DIRECTORY = upath.join( __dirname, '..' );

( async () => {
	// When installing a repository as a dependency, the `.git` directory does not exist.
	// In such a case, husky should not attach its hooks as npm treats it as a package, not a git repository.
	if ( fs.existsSync( upath.join( ROOT_DIRECTORY, '.git' ) ) ) {
		const husky = ( await import( 'husky' ) ).default;

		husky.install();
	}
} )();

/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * @param {string} directoryPath
 * @param {Logger} logger
 */
export default function initializeGitRepository( directoryPath, logger ) {
	logger.process( 'Initializing Git repository...' );

	const options = {
		stdio: 'ignore',
		cwd: directoryPath
	};

	execSync( 'git init', options );

	try {
		execSync( 'git add -A', options );
		execSync( 'git commit -m "Initialize the repository using CKEditor 5 Package Generator."', options );
	} catch ( error ) {
		// Remove the `.git` directory in case of an error. It may happen that the developer didn't configure Git yet.
		// We could have resolved the error ourselves.
		// See: https://github.com/ember-cli/ember-cli/blob/3192a441e13ec7e88c71d480778971d81bfa436c/lib/tasks/git-init.js#L49-L66.
		fs.rmSync( path.join( directoryPath, '.git' ), { recursive: true, force: true } );
	}
}

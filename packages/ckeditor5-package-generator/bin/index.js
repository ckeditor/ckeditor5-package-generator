#!/usr/bin/env node

/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import fs from 'fs-extra';
import upath from 'upath';
import { Command } from 'commander';
import init from '../lib/index.js';

const packageJson = fs.readJsonSync( upath.join( import.meta.dirname, '..', 'package.json' ) );

new Command( packageJson.name )
	.argument( '[packageName]', 'name of the package (@scope/ckeditor5-*)' )
	.option( '-v, --verbose', 'output additional logs', false )
	.option( '--dev', 'execution of the script in the development mode', isInsideGitRepositoryCallback, false )
	.option( '--use-npm', 'whether use npm to install packages', false )
	.option( '--use-yarn', 'whether use yarn to install packages', false )
	.option( '--use-pnpm', 'whether use pnpm to install packages', false )
	.option( '--use-release-directory', 'whether to use `release/` directory with `--dev` modifier', isInsideGitRepositoryCallback, false )
	.option( '--lang <lang>', 'programming language to use' )
	.option( '--plugin-name <name>', 'optional custom plugin name' )
	.option( '--installation-methods <method>', 'supported method of installation' )
	.option( '--global-name <name>', 'global name for UMD' )
	.allowUnknownOption()
	.version( packageJson.version )
	.addHelpText( 'after', `\nVersion: ${ packageJson.version }` )
	.action( ( packageName, options ) => {
		return init( packageName, options )
			.catch( error => {
				// Ctrl+C or prompt cancellation.
				if ( error.message && error.message.includes( 'SIGINT' ) ) {
					process.exit( 1 );
				} else {
					throw error;
				}
			} );
	} )
	.parse( process.argv );

function isInsideGitRepositoryCallback() {
	// An absolute path to the repository that tracks the package.
	const rootRepositoryPath = upath.join( import.meta.dirname, '..', '..', '..' );

	// The assumption here is that if the `--dev` flag was used, the entire repository is cloned.
	// Otherwise, the executable was downloaded from npm, and it can't be executed in dev-mode.
	return fs.existsSync( upath.join( rootRepositoryPath, '.git' ) );
}

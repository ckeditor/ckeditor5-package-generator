#!/usr/bin/env node

/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import fs from 'fs-extra';
import path from 'path';
import { Command } from 'commander';
import init from '../lib/index.js';

const packageJson = fs.readJsonSync( path.join( import.meta.dirname, '..', 'package.json' ) );

new Command( packageJson.name )
	.argument( '[packageName]', 'name of the package (@scope/ckeditor5-*)' )
	.option( '-v, --verbose', 'output additional logs', false )
	.option( '--dev', 'execution of the script in the development mode', () => {
		// An absolute path to the repository that tracks the package.
		const rootRepositoryPath = path.join( import.meta.dirname, '..', '..', '..' );

		// The assumption here is that if the `--dev` flag was used, the entire repository is cloned.
		// Otherwise, the executable was downloaded from npm, and it can't be executed in dev-mode.
		return fs.existsSync( path.join( rootRepositoryPath, '.git' ) );
	}, false )
	.option( '--use-npm', 'whether use npm to install packages', false )
	.option( '--use-yarn', 'whether use yarn to install packages', false )
	.option( '--use-pnpm', 'whether use pnpm to install packages', false )
	.option( '--lang <lang>', 'programming language to use' )
	.option( '--plugin-name <name>', 'optional custom plugin name' )
	.option( '--installation-methods <method>', 'supported method of installation' )
	.option( '--global-name <name>', 'global name for UMD' )
	.allowUnknownOption()
	.version( packageJson.version )
	.addHelpText( 'after', `\nVersion: ${ packageJson.version }` )
	.action( ( packageName, options ) => init( packageName, options ) )
	.parse( process.argv );

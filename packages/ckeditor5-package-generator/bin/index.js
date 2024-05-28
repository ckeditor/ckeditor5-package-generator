#!/usr/bin/env node

/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

const fs = require( 'fs' );
const path = require( 'path' );
const { Command } = require( 'commander' );

const packageJson = require( '../package.json' );

const init = require( '../lib/index' );

new Command( packageJson.name )
	.argument( '[packageName]', 'name of the package (@scope/ckeditor5-*)' )
	.option( '-v, --verbose', 'output additional logs', false )
	.option( '--dev', 'execution of the script in the development mode', () => {
		// An absolute path to the repository that tracks the package.
		const rootRepositoryPath = path.join( __dirname, '..', '..', '..' );

		// The assumption here is that if the `--dev` flag was used, the entire repository is cloned.
		// Otherwise, the executable was downloaded from npm, and it can't be executed in dev-mode.
		return fs.existsSync( path.join( rootRepositoryPath, '.git' ) );
	}, false )
	.option( '--use-npm', 'whether use npm to install packages', false )
	.option( '--use-yarn', 'whether use yarn to install packages', false )
	.option( '--lang <lang>', 'programming language to use' )
	.option( '--plugin-name <name>', 'optional custom plugin name' )
	.option( '--use-only-new-installation-methods', 'without using legacy methods of installations', false )
	.allowUnknownOption()
	.version( packageJson.version )
	.addHelpText( 'after', `\nVersion: ${ packageJson.version }` )
	.action( ( packageName, options ) => init( packageName, options ) )
	.parse( process.argv );

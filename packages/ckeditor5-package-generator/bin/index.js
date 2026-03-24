#!/usr/bin/env node

/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import fs from 'fs-extra';
import upath from 'upath';
import { cac } from 'cac';
import init from '../lib/index.js';

const packageJson = fs.readJsonSync( upath.join( import.meta.dirname, '..', 'package.json' ) );

const cli = cac( packageJson.name );

cli.command( '[packageName]', 'name of the package (ckeditor5-* or @scope/ckeditor5-*)' )
	.option( '-v, --verbose', 'output additional logs' )
	.option( '--use-npm', 'whether use npm to install packages' )
	.option( '--use-yarn', 'whether use yarn to install packages' )
	.option( '--use-pnpm', 'whether use pnpm to install packages' )
	.option( '--lang <lang>', 'programming language to use' )
	.option( '--plugin-name <name>', 'optional custom plugin name' )
	.option( '--global-name <name>', 'global name for UMD' )
	.allowUnknownOptions()
	.action( async ( packageName, options ) => {
		try {
			await init( packageName, options );
		} catch ( error ) {
			// Ctrl+C or prompt cancellation.
			if ( error.message && error.message.includes( 'SIGINT' ) ) {
				process.exit( 1 );
			}

			throw error;
		}
	} );

cli.help();
cli.version( packageJson.version, '-V, --version' );
cli.parse();

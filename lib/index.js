#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

const { Command } = require( 'commander' );
const CreateNewPackage = require( './tasks/createnewpackage' );
const { validateCKEditor5PackageName } = require( './utils/validators' );

const program = new Command();

program
	.option( '-v, --verbose', 'output about current task.', false )
	.command( 'create' )
	.argument( '<package-name>', 'name of the package to create', validateCKEditor5PackageName )
	.action( packageName => {
		return new CreateNewPackage( program.opts() ).execute( packageName );
	} );

program.parse( process.argv );

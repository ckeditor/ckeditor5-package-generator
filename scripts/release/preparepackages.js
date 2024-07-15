#!/usr/bin/env node

/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* eslint-env node */

'use strict';

const { Listr } = require( 'listr2' );
const releaseTools = require( '@ckeditor/ckeditor5-dev-release-tools' );
const parseArguments = require( './utils/parsearguments' );
const getListrOptions = require( './utils/getlistroptions' );
const { PACKAGE_GENERATOR_ROOT, PACKAGES_DIRECTORY, RELEASE_DIRECTORY } = require( './utils/constants' );
const upath = require( 'upath' );
const { globSync } = require( 'glob' );

const cliArguments = parseArguments( process.argv.slice( 2 ) );
const latestVersion = releaseTools.getLastFromChangelog();
const versionChangelog = releaseTools.getChangesForVersion( latestVersion );

const PACKAGE_GENERATOR_PACKAGES_NAMES = globSync( '*/', {
	cwd: upath.join( PACKAGE_GENERATOR_ROOT, PACKAGES_DIRECTORY ),
	absolute: true
} ).map( packagePath => {
	return require( upath.join( packagePath, 'package.json' ) ).name;
} );

const tasks = new Listr( [
	{
		title: 'Verifying the repository.',
		task: async () => {
			const errors = await releaseTools.validateRepositoryToRelease( {
				version: latestVersion,
				changes: versionChangelog,
				branch: cliArguments.branch
			} );

			if ( !errors.length ) {
				return;
			}

			return Promise.reject( 'Aborted due to errors.\n' + errors.map( message => `* ${ message }` ).join( '\n' ) );
		},
		skip: () => {
			// When compiling the packages only, do not validate the release.
			if ( cliArguments.compileOnly ) {
				return true;
			}

			return false;
		}
	},
	{
		title: 'Updating the `#version` field.',
		task: () => {
			return releaseTools.updateVersions( {
				packagesDirectory: PACKAGES_DIRECTORY,
				version: latestVersion
			} );
		},
		skip: () => {
			// When compiling the packages only, do not validate the release.
			if ( cliArguments.compileOnly ) {
				return true;
			}

			return false;
		}
	},
	{
		title: 'Updating dependencies.',
		task: () => {
			return releaseTools.updateDependencies( {
				version: '^' + latestVersion,
				packagesDirectory: PACKAGES_DIRECTORY,
				shouldUpdateVersionCallback: packageName => {
					return PACKAGE_GENERATOR_PACKAGES_NAMES.includes( packageName );
				}
			} );
		},
		skip: () => {
			// When compiling the packages only, do not validate the release.
			if ( cliArguments.compileOnly ) {
				return true;
			}

			return false;
		}
	},
	{
		title: 'Copying `package-generator` packages to the release directory.',
		task: () => {
			return releaseTools.prepareRepository( {
				outputDirectory: RELEASE_DIRECTORY,
				packagesDirectory: PACKAGES_DIRECTORY,
				packagesToCopy: cliArguments.packages
			} );
		}
	},
	{
		title: 'Cleaning-up.',
		task: () => {
			return releaseTools.cleanUpPackages( {
				packagesDirectory: RELEASE_DIRECTORY
			} );
		}
	},
	{
		title: 'Commit & tag.',
		task: () => {
			return releaseTools.commitAndTag( {
				version: latestVersion,
				files: [
					'package.json',
					`${ PACKAGES_DIRECTORY }/*/package.json`
				]
			} );
		},
		skip: () => {
			// When compiling the packages only, do not validate the release.
			if ( cliArguments.compileOnly ) {
				return true;
			}

			return false;
		}
	}
], getListrOptions( cliArguments ) );

tasks.run()
	.catch( err => {
		process.exitCode = 1;

		console.log( '' );
		console.error( err );
	} );

/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import Logger from '../lib/utils/logger.js';
import choosePackageManager from '../lib/utils/choose-package-manager.js';
import chooseProgrammingLanguage from '../lib/utils/choose-programming-language.js';
import setGlobalName from '../lib/utils/set-global-name.js';
import copyFiles from '../lib/utils/copy-files.js';
import createDirectory from '../lib/utils/create-directory.js';
import getDependenciesVersions from '../lib/utils/get-dependencies-versions.js';
import getPackageNameFormats from '../lib/utils/get-package-name-formats.js';
import initializeGitRepository from '../lib/utils/initialize-git-repository.js';
import installDependencies from '../lib/utils/install-dependencies.js';
import installGitHooks from '../lib/utils/install-git-hooks.js';
import validatePackageName from '../lib/utils/validate-package-name.js';
import validatePluginName from '../lib/utils/validate-plugin-name.js';
import index from '../lib/index.js';

const stubs = vi.hoisted( () => {
	const chalk = {
		green: vi.fn( input => input ),
		cyan: vi.fn( input => input ),
		underline: vi.fn( input => input ),
		gray: vi.fn( input => input ),
		yellow: vi.fn( input => input ),
		inverse: vi.fn( input => input )
	};

	// To make `chalk.bold.yellow.red()` working.
	for ( const rootKey of Object.keys( chalk ) ) {
		for ( const nestedKey of Object.keys( chalk ) ) {
			chalk[ rootKey ][ nestedKey ] = chalk[ nestedKey ];
		}
	}

	return {
		chalk,
		loggerInfo: vi.fn()
	};
} );

vi.mock( 'chalk', () => ( {
	default: stubs.chalk
} ) );
vi.mock( '../lib/utils/logger.js', () => ( {
	default: class Logger {
		constructor( verbose ) {
			this.verbose = verbose;
			this.info = stubs.loggerInfo;
		}
	}
} ) );
vi.mock( '../lib/utils/choose-package-manager.js' );
vi.mock( '../lib/utils/choose-programming-language.js' );
vi.mock( '../lib/utils/set-global-name.js' );
vi.mock( '../lib/utils/copy-files.js' );
vi.mock( '../lib/utils/create-directory.js' );
vi.mock( '../lib/utils/get-dependencies-versions.js' );
vi.mock( '../lib/utils/get-package-name-formats.js' );
vi.mock( '../lib/utils/initialize-git-repository.js' );
vi.mock( '../lib/utils/install-dependencies.js' );
vi.mock( '../lib/utils/install-git-hooks.js' );
vi.mock( '../lib/utils/validate-package-name.js' );
vi.mock( '../lib/utils/validate-plugin-name.js' );

describe( 'lib/index', () => {
	let options;

	const packageName = '@scope/ckeditor5-feature';

	beforeEach( () => {
		vi.mocked( getPackageNameFormats ).mockReturnValue( {
			package: {
				raw: 'xyz',
				spacedOut: 'Xyz',
				camelCase: 'xyz',
				pascalCase: 'Xyz',
				lowerCaseMerged: 'xyz'
			},
			plugin: {
				raw: 'BarBaz',
				spacedOut: 'Bar baz',
				camelCase: 'barBaz',
				pascalCase: 'BarBaz',
				lowerCaseMerged: 'barbaz'
			}
		} );

		vi.mocked( createDirectory ).mockReturnValue( {
			directoryName: 'directoryName',
			directoryPath: 'directoryPath'
		} );

		vi.mocked( choosePackageManager ).mockResolvedValue( 'yarn' );

		vi.mocked( chooseProgrammingLanguage ).mockResolvedValue( 'js' );

		vi.mocked( getDependenciesVersions ).mockResolvedValue( { ckeditor5: '30.0.0' } );

		vi.mocked( setGlobalName ).mockResolvedValue( 'GLOBAL' );

		vi.mocked( installDependencies ).mockResolvedValue();

		vi.mocked( installGitHooks ).mockResolvedValue();

		vi.mocked( validatePackageName ).mockImplementation( async ( logger, packageName ) => packageName );

		options = {
			verbose: true,
			useYarn: true,
			useNpm: false,
			usePnpm: false,
			pluginName: 'FooBar',
			lang: 'js',
			dev: false,
			globalName: 'GLOBAL',
			useReleaseDirectory: false
		};
	} );

	it( 'should be a function', () => {
		expect( index ).toBeTypeOf( 'function' );
	} );

	it( 'passes the verbose option when creating the logger ("true" check)', async () => {
		await index( packageName, options );

		const [ logger ] = validatePackageName.mock.calls[ 0 ];

		expect( logger.constructor.name ).toEqual( 'Logger' );
		expect( logger ).toEqual( { verbose: true, info: stubs.loggerInfo } );
	} );

	it( 'passes the verbose option when creating the logger ("false" check)', async () => {
		options.verbose = false;

		await index( packageName, options );

		const [ logger ] = validatePackageName.mock.calls[ 0 ];

		expect( logger.constructor.name ).toEqual( 'Logger' );
		expect( logger ).toEqual( { verbose: false, info: stubs.loggerInfo } );
	} );

	it( 'validates the package name', async () => {
		await index( packageName, options );

		expect( validatePackageName ).toHaveBeenCalledTimes( 1 );
		expect( validatePackageName ).toHaveBeenCalledWith( expect.any( Logger ), '@scope/ckeditor5-feature' );
	} );

	it( 'validates the plugin name', async () => {
		await index( packageName, options );

		expect( validatePluginName ).toHaveBeenCalledTimes( 1 );
		expect( validatePluginName ).toHaveBeenCalledWith( expect.any( Logger ), 'FooBar' );
	} );

	it( 'gets the package name formats', async () => {
		await index( packageName, options );

		expect( getPackageNameFormats ).toHaveBeenCalledTimes( 1 );
		expect( getPackageNameFormats ).toHaveBeenCalledWith( '@scope/ckeditor5-feature', 'FooBar' );
	} );

	it( 'creates the directory', async () => {
		await index( packageName, options );

		expect( createDirectory ).toHaveBeenCalledTimes( 1 );
		expect( createDirectory ).toHaveBeenCalledWith( expect.any( Logger ), '@scope/ckeditor5-feature' );
	} );

	it( 'chooses the package manager', async () => {
		await index( packageName, options );

		expect( choosePackageManager ).toHaveBeenCalledTimes( 1 );
		expect( choosePackageManager ).toHaveBeenCalledWith( expect.any( Logger ), { useNpm: false, useYarn: true, usePnpm: false } );
	} );

	it( 'chooses npx for npm package manager', async () => {
		vi.mocked( choosePackageManager ).mockResolvedValue( 'npm' );

		await index( packageName, options );

		expect( copyFiles ).toHaveBeenCalledWith(
			expect.any( Logger ),
			expect.objectContaining( { npxByPackageManager: 'npx' } )
		);
	} );

	it( 'chooses npx for yarn package manager', async () => {
		vi.mocked( choosePackageManager ).mockResolvedValue( 'yarn' );

		await index( packageName, options );

		expect( copyFiles ).toHaveBeenCalledWith(
			expect.any( Logger ),
			expect.objectContaining( { npxByPackageManager: 'npx' } )
		);
	} );

	it( 'chooses pnpm dlx for pnpm package manager', async () => {
		vi.mocked( choosePackageManager ).mockResolvedValue( 'pnpm' );

		await index( packageName, options );

		expect( copyFiles ).toHaveBeenCalledWith(
			expect.any( Logger ),
			expect.objectContaining( { npxByPackageManager: 'pnpm dlx' } )
		);
	} );

	it( 'chooses the programming language', async () => {
		await index( packageName, options );

		expect( chooseProgrammingLanguage ).toHaveBeenCalledTimes( 1 );
		expect( chooseProgrammingLanguage ).toHaveBeenCalledWith( expect.any( Logger ), 'js' );
	} );

	it( 'sets the global name', async () => {
		await index( packageName, options );

		expect( setGlobalName ).toHaveBeenCalledTimes( 1 );
		expect( setGlobalName ).toHaveBeenCalledWith( expect.any( Logger ), 'GLOBAL', 'CKBarBaz' );
	} );

	it( 'gets the versions of the dependencies', async () => {
		await index( packageName, options );

		expect( getDependenciesVersions ).toHaveBeenCalledTimes( 1 );
		expect( getDependenciesVersions ).toHaveBeenCalledWith( expect.any( Logger ), { dev: false, useReleaseDirectory: false } );
	} );

	it( 'gets the versions of the dependencies (`--dev`)', async () => {
		options.dev = true;
		await index( packageName, options );

		expect( getDependenciesVersions ).toHaveBeenCalledTimes( 1 );
		expect( getDependenciesVersions ).toHaveBeenCalledWith( expect.any( Logger ), { dev: true, useReleaseDirectory: false } );
	} );

	it( 'gets the versions of the dependencies (`--use-release-directory`)', async () => {
		options.useReleaseDirectory = true;
		await index( packageName, options );

		expect( getDependenciesVersions ).toHaveBeenCalledTimes( 1 );
		expect( getDependenciesVersions ).toHaveBeenCalledWith( expect.any( Logger ), { dev: false, useReleaseDirectory: true } );
	} );

	it( 'copies the files', async () => {
		await index( packageName, options );

		expect( copyFiles ).toHaveBeenCalledTimes( 1 );
		expect( copyFiles ).toHaveBeenCalledWith(
			expect.any( Logger ),
			{
				packageName: '@scope/ckeditor5-feature',
				programmingLanguage: 'js',
				validatedGlobalName: 'GLOBAL',
				formattedNames: {
					package: {
						raw: 'xyz',
						spacedOut: 'Xyz',
						camelCase: 'xyz',
						pascalCase: 'Xyz',
						lowerCaseMerged: 'xyz'
					},
					plugin: {
						raw: 'BarBaz',
						spacedOut: 'Bar baz',
						camelCase: 'barBaz',
						pascalCase: 'BarBaz',
						lowerCaseMerged: 'barbaz'
					}
				},
				packageManager: 'yarn',
				npxByPackageManager: 'npx',
				directoryPath: 'directoryPath',
				packageVersions: {
					ckeditor5: '30.0.0'
				}
			}
		);
	} );

	it( 'installs the dependencies', async () => {
		await index( packageName, options );

		expect( installDependencies ).toHaveBeenCalledTimes( 1 );
		expect( installDependencies ).toHaveBeenCalledWith( 'directoryPath', 'yarn', true, false );
	} );

	it( 'initializes the git repository', async () => {
		await index( packageName, options );

		expect( initializeGitRepository ).toHaveBeenCalledTimes( 1 );
		expect( initializeGitRepository ).toHaveBeenCalledWith( 'directoryPath', expect.any( Logger ) );
	} );

	it( 'installs the git hooks', async () => {
		await index( packageName, options );

		expect( installGitHooks ).toHaveBeenCalledTimes( 1 );
		expect( installGitHooks ).toHaveBeenCalledWith( 'directoryPath', expect.any( Logger ), true );
	} );

	it( 'logs info before the script finishes', async () => {
		await index( packageName, options );

		expect( stubs.loggerInfo ).toHaveBeenCalledTimes( 1 );
		expect( stubs.loggerInfo ).toHaveBeenCalledWith(
			[
				'Done!',
				'',
				'Execute the "cd directoryName" command to change the current working directory',
				'to the newly created package. Then, the package offers a few predefined scripts:',
				'',
				'  * start - for creating the HTTP server with the editor sample,',
				'  * build - for building the package,',
				'  * test - for executing unit tests of an example plugin,',
				'  * lint - for running a tool for static analyzing JavaScript files,',
				'  * stylelint - for running a tool for static analyzing CSS files.',
				'',
				'Example: yarn run start',
				''
			].join( '\n' ),
			{ startWithNewLine: true }
		);
	} );
} );

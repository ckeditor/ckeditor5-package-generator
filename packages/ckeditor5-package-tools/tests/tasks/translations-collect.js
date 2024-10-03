/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import glob from 'glob';
import { createPotFiles } from '@ckeditor/ckeditor5-dev-transifex';
import translationsCollect from '../../lib/tasks/translations-collect.js';

vi.mock( 'path', () => ( {
	default: {
		join: ( ...chunks ) => chunks.join( '/' )
	}
} ) );
vi.mock( 'glob' );
vi.mock( '@ckeditor/ckeditor5-dev-transifex' );

describe( 'lib/tasks/translations-collect', () => {
	beforeEach( () => {
		vi.mocked( createPotFiles ).mockReturnValue( 'OK' );
	} );

	it( 'should be a function', () => {
		expect( translationsCollect ).toBeTypeOf( 'function' );
	} );

	it( 'creates translation files (JavaScript)', () => {
		const sourceFiles = [
			'/workspace/ckeditor5-foo/src/index.js',
			'/workspace/ckeditor5-foo/src/myplugin.js'
		];

		vi.mocked( glob.sync ).mockReturnValue( sourceFiles );

		const results = translationsCollect( {
			cwd: '/workspace'
		} );

		expect( results ).toEqual( 'OK' );

		expect( glob.sync ).toHaveBeenCalledTimes( 1 );
		expect( glob.sync ).toHaveBeenCalledWith( '/workspace/src/**/*.[jt]s' );

		expect( createPotFiles ).toHaveBeenCalledTimes( 1 );
		expect( createPotFiles ).toHaveBeenCalledWith( {
			// Verify results returned by `glob.sync()`.
			sourceFiles,
			// Verify a path to the `@ckeditor/ckeditor5-core` package.
			corePackagePath: 'node_modules/@ckeditor/ckeditor5-core',
			// Verify ignoring unused contexts from the `@ckeditor/ckeditor5-core` package.
			ignoreUnusedCorePackageContexts: true,
			// Verify a path where to look for packages.
			packagePaths: [
				'/workspace'
			],
			// Verify the license header in translation files.
			skipLicenseHeader: true,
			// Verify a path where translations will be stored.
			translationsDirectory: '/workspace/tmp/.transifex'
		} );
	} );

	it( 'creates translation files (TypeScript)', () => {
		const sourceFiles = [
			'/workspace/ckeditor5-foo/src/index.ts',
			'/workspace/ckeditor5-foo/src/myplugin.ts'
		];

		vi.mocked( glob.sync ).mockReturnValue( sourceFiles );

		const results = translationsCollect( {
			cwd: '/workspace'
		} );

		expect( results ).toEqual( 'OK' );

		expect( glob.sync ).toHaveBeenCalledTimes( 1 );
		expect( glob.sync ).toHaveBeenCalledWith( '/workspace/src/**/*.[jt]s' );

		expect( createPotFiles ).toHaveBeenCalledTimes( 1 );
		expect( createPotFiles ).toHaveBeenCalledWith( {
			// Verify results returned by `glob.sync()`.
			sourceFiles,
			// Verify a path to the `@ckeditor/ckeditor5-core` package.
			corePackagePath: 'node_modules/@ckeditor/ckeditor5-core',
			// Verify ignoring unused contexts from the `@ckeditor/ckeditor5-core` package.
			ignoreUnusedCorePackageContexts: true,
			// Verify a path where to look for packages.
			packagePaths: [
				'/workspace'
			],
			// Verify the license header in translation files.
			skipLicenseHeader: true,
			// Verify a path where translations will be stored.
			translationsDirectory: '/workspace/tmp/.transifex'
		} );
	} );

	it( 'passes posix paths to glob', () => {
		const results = translationsCollect( {
			cwd: 'C:\\workspace'
		} );

		expect( results ).toEqual( 'OK' );

		expect( glob.sync ).toHaveBeenCalledTimes( 1 );
		expect( glob.sync ).toHaveBeenCalledWith( 'C:/workspace/src/**/*.[jt]s' );
	} );
} );

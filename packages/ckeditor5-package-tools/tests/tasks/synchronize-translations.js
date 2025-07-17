/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi } from 'vitest';
import glob from 'glob';
import * as devTranslations from '@ckeditor/ckeditor5-dev-translations';
import synchronizeTranslations from '../../lib/tasks/synchronize-translations.js';

vi.mock( 'path', async importOriginal => {
	const mod = await importOriginal();

	return {
		...mod,
		default: {
			...mod.default,
			join: ( ...chunks ) => chunks.join( '/' )
		}
	};
} );
vi.mock( 'glob' );
vi.mock( '@ckeditor/ckeditor5-dev-translations' );

describe( 'lib/tasks/synchronize-translations', () => {
	it( 'should be a function', () => {
		expect( synchronizeTranslations ).toBeTypeOf( 'function' );
	} );

	it( 'synchronizes translation messages (JavaScript)', () => {
		const sourceFiles = [
			'/workspace/ckeditor5-foo/src/index.js',
			'/workspace/ckeditor5-foo/src/myplugin.js'
		];

		vi.mocked( glob.sync ).mockReturnValue( sourceFiles );

		synchronizeTranslations( {
			cwd: '/workspace',
			validateOnly: false
		} );

		expect( glob.sync ).toHaveBeenCalledTimes( 1 );
		expect( glob.sync ).toHaveBeenCalledWith( '/workspace/src/**/*.[jt]s' );

		expect( devTranslations.synchronizeTranslations ).toHaveBeenCalledTimes( 1 );
		expect( devTranslations.synchronizeTranslations ).toHaveBeenCalledWith( {
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
			// Verify the validation-only mode.
			validateOnly: false
		} );
	} );

	it( 'synchronizes translation messages (TypeScript)', () => {
		const sourceFiles = [
			'/workspace/ckeditor5-foo/src/index.ts',
			'/workspace/ckeditor5-foo/src/myplugin.ts'
		];

		vi.mocked( glob.sync ).mockReturnValue( sourceFiles );

		synchronizeTranslations( {
			cwd: '/workspace',
			validateOnly: false
		} );

		expect( glob.sync ).toHaveBeenCalledTimes( 1 );
		expect( glob.sync ).toHaveBeenCalledWith( '/workspace/src/**/*.[jt]s' );

		expect( devTranslations.synchronizeTranslations ).toHaveBeenCalledTimes( 1 );
		expect( devTranslations.synchronizeTranslations ).toHaveBeenCalledWith( {
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
			// Verify the validation-only mode.
			validateOnly: false
		} );
	} );

	it( 'validates translation messages', () => {
		synchronizeTranslations( {
			validateOnly: true
		} );

		expect( devTranslations.synchronizeTranslations ).toHaveBeenCalledTimes( 1 );
		expect( devTranslations.synchronizeTranslations ).toHaveBeenCalledWith( expect.objectContaining( {
			// Verify the validation-only mode.
			validateOnly: true
		} ) );
	} );

	it( 'passes posix paths to glob', () => {
		synchronizeTranslations( {
			cwd: 'C:\\workspace'
		} );

		expect( glob.sync ).toHaveBeenCalledTimes( 1 );
		expect( glob.sync ).toHaveBeenCalledWith( 'C:/workspace/src/**/*.[jt]s' );
	} );
} );

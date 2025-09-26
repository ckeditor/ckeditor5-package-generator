/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi } from 'vitest';
import upath from 'upath';
import { globSync } from 'glob';
import * as devTranslations from '@ckeditor/ckeditor5-dev-translations';
import synchronizeTranslations from '../../lib/tasks/synchronize-translations.js';

vi.mock( 'module', () => ( {
	default: {
		createRequire: () => ( { resolve: () => upath.resolve( process.cwd(), 'node_modules/@ckeditor/ckeditor5-core/package.json' ) } )
	}
} ) );

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

		vi.mocked( globSync ).mockReturnValue( sourceFiles );

		synchronizeTranslations( {
			cwd: '/workspace',
			validateOnly: false
		} );

		expect( globSync ).toHaveBeenCalledTimes( 1 );
		expect( globSync ).toHaveBeenCalledWith( '/workspace/src/**/*.[jt]s' );

		expect( devTranslations.synchronizeTranslations ).toHaveBeenCalledTimes( 1 );
		expect( devTranslations.synchronizeTranslations ).toHaveBeenCalledWith( {
			// Verify results returned by `globSync()`.
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

		vi.mocked( globSync ).mockReturnValue( sourceFiles );

		synchronizeTranslations( {
			cwd: '/workspace',
			validateOnly: false
		} );

		expect( globSync ).toHaveBeenCalledTimes( 1 );
		expect( globSync ).toHaveBeenCalledWith( '/workspace/src/**/*.[jt]s' );

		expect( devTranslations.synchronizeTranslations ).toHaveBeenCalledTimes( 1 );
		expect( devTranslations.synchronizeTranslations ).toHaveBeenCalledWith( {
			// Verify results returned by `globSync()`.
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
			cwd: '/workspace',
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

		expect( globSync ).toHaveBeenCalledTimes( 1 );
		expect( globSync ).toHaveBeenCalledWith( 'C:/workspace/src/**/*.[jt]s' );
	} );
} );

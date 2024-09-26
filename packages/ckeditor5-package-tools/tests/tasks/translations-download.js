/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs-extra';
import { getToken, downloadTranslations } from '@ckeditor/ckeditor5-dev-transifex';
import translationsDownload from '../../lib/tasks/translations-download.js';

vi.mock( 'path', () => ( {
	default: {
		join: ( ...chunks ) => chunks.join( '/' )
	}
} ) );
vi.mock( 'fs-extra' );
vi.mock( '@ckeditor/ckeditor5-dev-transifex' );

describe( 'lib/tasks/translations-download', () => {
	beforeEach( () => {
		vi.mocked( getToken ).mockResolvedValue( 'secretToken' );
		vi.mocked( downloadTranslations ).mockResolvedValue( 'OK' );
		vi.mocked( fs.readJsonSync ).mockImplementation( filePath => {
			if ( filePath === '/workspace/package.json' ) {
				return {
					name: 'ckeditor5-foo'
				};
			}
		} );
	} );

	it( 'should be a function', () => {
		expect( translationsDownload ).toBeTypeOf( 'function' );
	} );

	it( 'downloads translation files for package "ckeditor5-foo"', async () => {
		const results = await translationsDownload( {
			cwd: '/workspace',
			organization: 'foo',
			project: 'bar'
		} );

		expect( results ).toEqual( 'OK' );

		expect( downloadTranslations ).toHaveBeenCalledTimes( 1 );
		expect( downloadTranslations ).toHaveBeenCalledWith( {
			token: 'secretToken',
			organizationName: 'foo',
			projectName: 'bar',
			cwd: '/workspace',
			packages: new Map( [
				[ 'ckeditor5-foo', '.' ]
			] ),
			simplifyLicenseHeader: true
		} );
	} );

	it( 'downloads translation files for package "@ckeditor/ckeditor5-foo"', async () => {
		const results = await translationsDownload( {
			cwd: '/workspace',
			organization: 'foo',
			project: 'bar'
		} );

		expect( results ).toEqual( 'OK' );

		expect( downloadTranslations ).toHaveBeenCalledTimes( 1 );
		expect( downloadTranslations ).toHaveBeenCalledWith( {
			token: 'secretToken',
			organizationName: 'foo',
			projectName: 'bar',
			cwd: '/workspace',
			packages: new Map( [
				[ 'ckeditor5-foo', '.' ]
			] ),
			simplifyLicenseHeader: true
		} );
	} );

	it( 'throws an error if the "organization" option is not specified', async () => {
		try {
			await translationsDownload( {
				cwd: '/workspace'
			} );
		} catch ( err ) {
			expect( err.message ).toEqual(
				'The organization name is required. Use --organization [organization name] to provide the value.'
			);
		}
	} );

	it( 'throws an error if the "project" option is not specified', async () => {
		try {
			await translationsDownload( {
				cwd: '/workspace',
				organization: 'foo'
			} );
		} catch ( err ) {
			expect( err.message ).toEqual(
				'The project name is required. Use --project [project name] to provide the value.'
			);
		}
	} );

	it( 'throws an error if the "transifex" option is specified', async () => {
		try {
			await translationsDownload( {
				cwd: '/workspace',
				organization: 'foo',
				project: 'bar',
				transifex: 'https://api.example.com'
			} );
		} catch ( err ) {
			expect( err.message ).toEqual(
				'The --transifex [API end-point] option is no longer supported. Use `--organization` and `--project` instead.'
			);
		}
	} );
} );

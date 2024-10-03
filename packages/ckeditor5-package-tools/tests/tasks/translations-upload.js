/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs-extra';
import { getToken, uploadPotFiles } from '@ckeditor/ckeditor5-dev-transifex';
import translationsUpload from '../../lib/tasks/translations-upload.js';

vi.mock( 'path', () => ( {
	default: {
		join: ( ...chunks ) => chunks.join( '/' )
	}
} ) );
vi.mock( 'fs-extra' );
vi.mock( '@ckeditor/ckeditor5-dev-transifex' );

describe( 'lib/tasks/translations-upload', () => {
	beforeEach( () => {
		vi.mocked( getToken ).mockResolvedValue( 'secretToken' );
		vi.mocked( uploadPotFiles ).mockResolvedValue( 'OK' );
		vi.mocked( fs.readJsonSync ).mockImplementation( filePath => {
			if ( filePath === '/workspace/package.json' ) {
				return {
					name: '@ckeditor/ckeditor5-foo'
				};
			}
		} );
	} );

	it( 'should be a function', () => {
		expect( translationsUpload ).toBeTypeOf( 'function' );
	} );

	it( 'uploads translation files for package "ckeditor5-foo"', async () => {
		vi.mocked( fs.readJsonSync ).mockImplementation( filePath => {
			if ( filePath === '/workspace/package.json' ) {
				return {
					name: 'ckeditor5-foo'
				};
			}
		} );

		const results = await translationsUpload( {
			cwd: '/workspace',
			organization: 'foo',
			project: 'bar'
		} );

		expect( results ).toEqual( 'OK' );

		expect( uploadPotFiles ).toHaveBeenCalledTimes( 1 );
		expect( uploadPotFiles ).toHaveBeenCalledWith( {
			token: 'secretToken',
			cwd: '/workspace',
			organizationName: 'foo',
			packages: new Map( [
				[ 'ckeditor5-foo', 'tmp/.transifex/ckeditor5-foo' ]
			] ),
			projectName: 'bar'
		} );
	} );

	it( 'uploads translation files for package "@ckeditor/ckeditor5-foo"', async () => {
		const results = await translationsUpload( {
			cwd: '/workspace',
			organization: 'foo',
			project: 'bar'
		} );

		expect( results ).toEqual( 'OK' );

		expect( uploadPotFiles ).toHaveBeenCalledTimes( 1 );
		expect( uploadPotFiles ).toHaveBeenCalledWith( {
			token: 'secretToken',
			cwd: '/workspace',
			organizationName: 'foo',
			packages: new Map( [
				[ 'ckeditor5-foo', 'tmp/.transifex/ckeditor5-foo' ]
			] ),
			projectName: 'bar'
		} );
	} );

	it( 'throws an error if the "organization" option is not specified', async () => {
		try {
			await translationsUpload( {
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
			await translationsUpload( {
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
			await translationsUpload( {
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

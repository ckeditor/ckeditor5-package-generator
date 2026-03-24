/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'node:fs';
import mkdirp from 'mkdirp';
import createDirectory from '../../lib/utils/create-directory.js';

vi.mock( 'chalk', () => ( {
	default: {
		cyan: str => str
	}
} ) );
vi.mock( 'upath', () => ( {
	default: {
		resolve: ( ...chunks ) => [ 'resolved', ...chunks ].join( '/' )
	}
} ) );
vi.mock( 'fs' );
vi.mock( 'mkdirp' );

describe( 'lib/utils/create-directory', () => {
	let stubs;

	beforeEach( () => {
		vi.spyOn( process, 'exit' ).mockImplementation( () => {} );

		stubs = {
			logger: {
				process: vi.fn(),
				error: vi.fn()
			}
		};
	} );

	it( 'should be a function', () => {
		expect( createDirectory ).toBeTypeOf( 'function' );
	} );

	it( 'creates the directory', () => {
		createDirectory( stubs.logger, '@foo/ckeditor5-bar' );

		expect( mkdirp.sync ).toHaveBeenCalledTimes( 1 );
		expect( mkdirp.sync ).toHaveBeenCalledWith( 'resolved/ckeditor5-bar' );
	} );

	it( 'logs an error and exits the process if the directory already exists', () => {
		vi.mocked( fs.existsSync ).mockReturnValue( true );

		createDirectory( stubs.logger, '@foo/ckeditor5-bar' );

		expect( stubs.logger.error ).toHaveBeenCalledTimes( 2 );
		expect( stubs.logger.error ).toHaveBeenNthCalledWith( 1, 'Cannot create a directory as the location is already taken.' );
		expect( stubs.logger.error ).toHaveBeenNthCalledWith( 2, 'Aborting.' );

		expect( process.exit ).toHaveBeenCalledTimes( 1 );
	} );

	it( 'returns directory name and path', () => {
		const result = createDirectory( stubs.logger, '@foo/ckeditor5-bar' );

		expect( result ).toEqual( {
			directoryName: 'ckeditor5-bar',
			directoryPath: 'resolved/ckeditor5-bar'
		} );
	} );

	it( 'uses the full package name as directory name for unscoped packages', () => {
		const result = createDirectory( stubs.logger, 'ckeditor5-bar' );

		expect( result ).toEqual( {
			directoryName: 'ckeditor5-bar',
			directoryPath: 'resolved/ckeditor5-bar'
		} );
	} );
} );

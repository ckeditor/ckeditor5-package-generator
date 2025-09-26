/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { tools } from '@ckeditor/ckeditor5-dev-utils';
import updateEntryPoint from '../../lib/utils/update-entry-point.js';

vi.mock( '@ckeditor/ckeditor5-dev-utils' );

describe( 'lib/utils/update-entry-point', () => {
	let pkgJsonTS, pkgJsonJS;

	const cwd = '/process/cwd';

	beforeEach( () => {
		pkgJsonTS = {
			'name': '@foo/ckeditor5-bar',
			'version': '0.0.1',
			'description': 'A plugin for CKEditor 5.',
			'main': 'src/index.ts',
			'license': 'MIT'
		};

		pkgJsonJS = {
			'name': '@foo/ckeditor5-bar',
			'version': '0.0.1',
			'description': 'A plugin for CKEditor 5.',
			'main': 'src/index.js',
			'license': 'MIT'
		};
	} );

	it( 'should be a function', () => {
		expect( updateEntryPoint ).toBeTypeOf( 'function' );
	} );

	it( 'updates the "main" field to point to a js file', () => {
		updateEntryPoint( { cwd }, 'js' );

		expect( tools.updateJSONFile ).toHaveBeenCalledTimes( 1 );
		expect( tools.updateJSONFile ).toHaveBeenCalledWith( '/process/cwd/package.json', expect.any( Function ) );

		const [ , callback ] = tools.updateJSONFile.mock.calls[ 0 ];

		expect( callback( pkgJsonTS ) ).toEqual( pkgJsonJS );
	} );

	it( 'updates the "main" field to point to a ts file', () => {
		updateEntryPoint( { cwd }, 'ts' );

		expect( tools.updateJSONFile ).toHaveBeenCalledTimes( 1 );
		expect( tools.updateJSONFile ).toHaveBeenCalledWith( '/process/cwd/package.json', expect.any( Function ) );

		const [ , callback ] = tools.updateJSONFile.mock.calls[ 0 ];

		expect( callback( pkgJsonJS ) ).toEqual( pkgJsonTS );
	} );

	it( 'keeps the "main" field unchanged if it points to a file with the same extension as the argument received', () => {
		updateEntryPoint( { cwd }, 'js' );

		expect( tools.updateJSONFile ).toHaveBeenCalledTimes( 1 );
		expect( tools.updateJSONFile ).toHaveBeenCalledWith( '/process/cwd/package.json', expect.any( Function ) );

		const [ , callback ] = tools.updateJSONFile.mock.calls[ 0 ];

		expect( callback( pkgJsonJS ) ).toEqual( pkgJsonJS );
	} );
} );

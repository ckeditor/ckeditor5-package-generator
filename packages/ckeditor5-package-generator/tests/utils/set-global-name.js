/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { promptText, showNote } from '../../lib/utils/prompt.js';
import { getGlobalNameValidationError } from '../../lib/utils/validate-global-name.js';
import setGlobalName from '../../lib/utils/set-global-name.js';

vi.mock( '../../lib/utils/prompt.js' );
vi.mock( '../../lib/utils/validate-global-name.js', () => ( {
	getGlobalNameValidationError: vi.fn()
} ) );

describe( 'lib/utils/set-global-name', () => {
	beforeEach( () => {
		vi.mocked( promptText ).mockResolvedValue( 'GLOBAL' );
		vi.mocked( getGlobalNameValidationError ).mockReturnValue( null );
	} );

	it( 'should be a function', () => {
		expect( setGlobalName ).toBeTypeOf( 'function' );
	} );

	it( 'returns the provided global name when it is valid', async () => {
		const result = await setGlobalName( 'GLOBAL', 'CKCustomPlugin' );

		expect( result ).toEqual( 'GLOBAL' );
		expect( promptText ).not.toHaveBeenCalled();
		expect( showNote ).not.toHaveBeenCalled();
	} );

	it( 'prompts for the global name when it is missing', async () => {
		await setGlobalName( '', 'CKCustomPlugin' );

		expect( promptText ).toHaveBeenCalledTimes( 1 );
		expect( promptText ).toHaveBeenCalledWith( {
			message: 'Global name for UMD build',
			initialValue: 'CKCustomPlugin',
			validate: expect.any( Function )
		} );
	} );

	it( 'prompt validator accepts valid global names', async () => {
		await setGlobalName( '', 'CKCustomPlugin' );

		const validator = vi.mocked( promptText ).mock.calls[ 0 ][ 0 ].validate;

		expect( validator( 'CKCustomPlugin' ) ).toBeUndefined();
	} );

	it( 'prompt validator rejects empty global names', async () => {
		vi.mocked( getGlobalNameValidationError ).mockImplementation( value => {
			if ( !value ) {
				return 'The global name can not be an empty string.';
			}

			return null;
		} );

		await setGlobalName( '', 'CKCustomPlugin' );

		const validator = vi.mocked( promptText ).mock.calls[ 0 ][ 0 ].validate;

		expect( validator( '' ) ).toEqual( 'The global name can not be an empty string.' );
	} );

	it( 'shows a note and prompts when the provided global name is invalid', async () => {
		vi.mocked( getGlobalNameValidationError ).mockReturnValue( 'The global name can not start with a digit.' );

		await setGlobalName( '1234foobar', 'CKCustomPlugin' );

		expect( showNote ).toHaveBeenCalledWith(
			expect.stringContaining( 'The global name can not start with a digit.' ),
			'Global name'
		);
		expect( promptText ).toHaveBeenCalledWith( expect.objectContaining( {
			initialValue: 'CKCustomPlugin'
		} ) );
	} );
} );

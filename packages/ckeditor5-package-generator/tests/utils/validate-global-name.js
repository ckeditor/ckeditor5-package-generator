/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect } from 'vitest';
import { getGlobalNameValidationError } from '../../lib/utils/validate-global-name.js';

describe( 'lib/utils/validate-global-name', () => {
	it( 'should export a function', () => {
		expect( getGlobalNameValidationError ).toBeTypeOf( 'function' );
	} );

	it( 'returns null when the global name is valid', () => {
		expect( getGlobalNameValidationError( 'Foo' ) ).toBeNull();
	} );

	it( 'rejects empty strings', () => {
		expect( getGlobalNameValidationError( '' ) ).toEqual( 'The global name can not be an empty string.' );
	} );

	it( 'rejects non-allowed characters', () => {
		expect( getGlobalNameValidationError( '#abc' ) ).toEqual( 'The global name contains non-allowed characters.' );
	} );

	it( 'rejects names starting with digits', () => {
		expect( getGlobalNameValidationError( '9Abc' ) ).toEqual( 'The global name can not start with a digit.' );
	} );

	it( 'rejects names that start or end with a slash', () => {
		expect( getGlobalNameValidationError( '/9Abc/' ) ).toEqual(
			'The global name can not start with "/" and end with "/" characters.'
		);
	} );

	it( 'accepts names that only contain letters', () => {
		expect( getGlobalNameValidationError( 'FooBar' ) ).toBeNull();
	} );

	it( 'accepts names that fit the pattern', () => {
		expect( getGlobalNameValidationError( 'Foo9@_bar' ) ).toBeNull();
	} );
} );

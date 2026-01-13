/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import validateGlobalName from '../../lib/utils/validate-global-name.js';

vi.mock( 'chalk', () => ( {
	default: {
		red: vi.fn( str => str ),
		blue: vi.fn( str => str )
	}
} ) );

describe( 'lib/utils/validate-global-name', () => {
	let stubs;

	beforeEach( () => {
		stubs = {
			logger: {
				error: vi.fn(),
				info: vi.fn()
			}
		};
	} );

	it( 'should be a function', () => {
		expect( validateGlobalName ).toBeTypeOf( 'function' );
	} );

	it( 'Returns `true` if the plugin name is provided and it passed the validation', () => {
		const result = validateGlobalName( stubs.logger, 'Foo' );

		expect( result ).toEqual( true );
	} );

	it( 'logs info when global name is an empty string', () => {
		validateGlobalName( stubs.logger, '' );

		expect( stubs.logger.error ).toHaveBeenCalledTimes( 2 );
		expect( stubs.logger.error ).toHaveBeenNthCalledWith(
			1,
			'❗ Found an error while verifying the provided global name:',
			{ startWithNewLine: true }
		);
		expect( stubs.logger.error ).toHaveBeenNthCalledWith(
			2,
			'The global name can not be an empty string.'
		);

		expect( stubs.logger.info ).toHaveBeenCalledTimes( 2 );
		expect( stubs.logger.info ).toHaveBeenNthCalledWith( 1, 'The provided global name:    ' );
		expect( stubs.logger.info ).toHaveBeenNthCalledWith( 2, 'Allowed characters list:     0-9 A-Z a-z _ - / @' );
	} );

	it( 'logs info about incorrect global name format', () => {
		validateGlobalName( stubs.logger, '#abc' );

		expect( stubs.logger.error ).toHaveBeenCalledTimes( 2 );
		expect( stubs.logger.error ).toHaveBeenNthCalledWith( 1,
			'❗ Found an error while verifying the provided global name:',
			{ startWithNewLine: true }
		);
		expect( stubs.logger.error ).toHaveBeenNthCalledWith(
			2,
			'The global name contains non-allowed characters.'
		);

		expect( stubs.logger.info ).toHaveBeenCalledTimes( 2 );
		expect( stubs.logger.info ).toHaveBeenNthCalledWith( 1, 'The provided global name:    #abc' );
		expect( stubs.logger.info ).toHaveBeenNthCalledWith( 2, 'Allowed characters list:     0-9 A-Z a-z _ - / @' );
	} );

	it( 'logs info about incorrect global name format when it\'s not starts with a letter', () => {
		validateGlobalName( stubs.logger, '9Abc' );

		expect( stubs.logger.error ).toHaveBeenCalledTimes( 2 );
		expect( stubs.logger.error ).toHaveBeenNthCalledWith( 1,
			'❗ Found an error while verifying the provided global name:',
			{ startWithNewLine: true }
		);
		expect( stubs.logger.error ).toHaveBeenNthCalledWith(
			2, 'The global name can not start with a digit.'
		);

		expect( stubs.logger.info ).toHaveBeenCalledTimes( 2 );
		expect( stubs.logger.info ).toHaveBeenNthCalledWith( 1, 'The provided global name:    9Abc' );
		expect( stubs.logger.info ).toHaveBeenNthCalledWith( 2, 'Allowed characters list:     0-9 A-Z a-z _ - / @' );
	} );

	it( 'logs info about incorrect global name format when it\'s starts with a `/` or ends with a `/``', () => {
		validateGlobalName( stubs.logger, '/9Abc/' );

		expect( stubs.logger.error ).toHaveBeenCalledTimes( 2 );
		expect( stubs.logger.error ).toHaveBeenNthCalledWith(
			1,
			'❗ Found an error while verifying the provided global name:',
			{ startWithNewLine: true }
		);
		expect( stubs.logger.error ).toHaveBeenNthCalledWith(
			2,
			'The global name can not start with "/" and end with "/" characters.'
		);

		expect( stubs.logger.info ).toHaveBeenCalledTimes( 2 );
		expect( stubs.logger.info ).toHaveBeenNthCalledWith( 1, 'The provided global name:    /9Abc/' );
		expect( stubs.logger.info ).toHaveBeenNthCalledWith( 2, 'Allowed characters list:     0-9 A-Z a-z _ - / @' );
	} );

	it( 'accepts plugin names that only contain letters', () => {
		const result = validateGlobalName( stubs.logger, 'FooBar' );

		expect( result ).toEqual( true );
		expect( stubs.logger.error ).not.toHaveBeenCalled();
	} );

	it( 'accepts plugin names that fit the patter', () => {
		const result = validateGlobalName( stubs.logger, 'Foo9@_bar' );

		expect( result ).toEqual( true );
		expect( stubs.logger.error ).not.toHaveBeenCalled();
	} );
} );

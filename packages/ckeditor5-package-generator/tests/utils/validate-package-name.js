/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import validatePackageName from '../../lib/utils/validate-package-name.js';

vi.mock( 'chalk', () => ( {
	default: {
		green: vi.fn( str => str ),
		red: vi.fn( str => str ),
		blue: vi.fn( str => str )
	}
} ) );

describe( 'lib/utils/validate-package-name', () => {
	let stubs;

	beforeEach( () => {
		vi.spyOn( process, 'exit' ).mockImplementation( () => {} );

		stubs = {
			logger: {
				error: vi.fn(),
				info: vi.fn(),
				process: vi.fn()
			}
		};
	} );

	it( 'should be a function', () => {
		expect( validatePackageName ).toBeTypeOf( 'function' );
	} );

	it( 'logs the process', () => {
		validatePackageName( stubs.logger, undefined );

		expect( stubs.logger.process ).toHaveBeenCalledTimes( 1 );
		expect( stubs.logger.process ).toHaveBeenCalledWith( 'Verifying the specified package name.' );
	} );

	it( 'logs info about correct package name format in case of incorrect name', () => {
		validatePackageName( stubs.logger, 'foo-bar' );

		expect( stubs.logger.error ).toHaveBeenCalledTimes( 2 );
		expect( stubs.logger.error ).toHaveBeenNthCalledWith(
			1,
			'❗ Found an error while verifying the provided package name:',
			{ startWithNewLine: true }
		);

		expect( stubs.logger.info ).toHaveBeenCalledTimes( 3 );
		expect( stubs.logger.info ).toHaveBeenNthCalledWith(
			1,
			'Expected pattern:            @[scope]/ckeditor5-[feature-name]',
			{ startWithNewLine: true }
		);
		expect( stubs.logger.info ).toHaveBeenNthCalledWith( 2, 'The provided package name:   foo-bar' );
		expect( stubs.logger.info ).toHaveBeenNthCalledWith( 3, 'Allowed characters list:     0-9 a-z - . _' );
	} );

	describe( 'verifying package name length', () => {
		it( 'rejects undefined value', () => {
			validatePackageName( stubs.logger, undefined );

			expect( process.exit ).toHaveBeenCalled();
			expect( stubs.logger.error ).toHaveBeenNthCalledWith(
				2,
				'The package name cannot be an empty string - pass the name as the first argument to the script.'
			);
		} );

		it( 'rejects an empty package name', () => {
			validatePackageName( stubs.logger, '' );

			expect( process.exit ).toHaveBeenCalled();
			expect( stubs.logger.error ).toHaveBeenNthCalledWith(
				2,
				'The package name cannot be an empty string - pass the name as the first argument to the script.'
			);
		} );

		it( 'accepts a name lesser than 214 characters', () => {
			validatePackageName( stubs.logger, '@ckeditor/ckeditor5-foo' );

			expect( process.exit ).not.toHaveBeenCalled();
			expect( stubs.logger.error ).not.toHaveBeenCalled();
		} );

		it( 'accepts the length of a name equal to 214', () => {
			// 214 is a limit, 21 is the length of the string, the rest is "o".
			validatePackageName( stubs.logger, '@ckeditor/ckeditor5-f' + 'o'.repeat( 193 ) );

			expect( process.exit ).not.toHaveBeenCalled();
			expect( stubs.logger.error ).not.toHaveBeenCalled();
		} );

		it( 'rejects a name longer than 214 characters', () => {
			// 214 is a limit, 21 is the length of the string, the rest is "o". Add 1 to exceed the limit.
			validatePackageName( stubs.logger, '@ckeditor/ckeditor5-f' + 'o'.repeat( 194 ) );

			expect( process.exit ).toHaveBeenCalled();
			expect( stubs.logger.error ).toHaveBeenNthCalledWith(
				2,
				'The length of the package name cannot be longer than 214 characters.'
			);
		} );
	} );

	describe( 'verifying capital letters', () => {
		it( 'rejects a package name if it contains at least a single capital letter', () => {
			validatePackageName( stubs.logger, '@ckeditor/ckeditor5-Foo' );

			expect( process.exit ).toHaveBeenCalled();
			expect( stubs.logger.error ).toHaveBeenNthCalledWith( 2, 'The package name cannot contain capital letters.' );
		} );
	} );

	describe( 'verifying compliance with the pattern', () => {
		it( 'rejects the package name without a scope', () => {
			validatePackageName( stubs.logger, 'ckeditor5-foo' );

			expect( process.exit ).toHaveBeenCalled();
			expect( stubs.logger.error ).toHaveBeenNthCalledWith(
				2,
				'The package name must match the "@[scope]/ckeditor5-[feature-name]" pattern.'
			);
		} );

		it( 'rejects the package name if the scope misses the "at" (@) character at the beginning', () => {
			validatePackageName( stubs.logger, 'ckeditor/ckeditor5-foo' );

			expect( process.exit ).toHaveBeenCalled();
			expect( stubs.logger.error ).toHaveBeenNthCalledWith(
				2,
				'The package name must match the "@[scope]/ckeditor5-[feature-name]" pattern.'
			);
		} );

		it( 'rejects the package name if the name ends with the slash (/)', () => {
			validatePackageName( stubs.logger, '@ckeditor/ckeditor5-foo/' );

			expect( process.exit ).toHaveBeenCalled();
			expect( stubs.logger.error ).toHaveBeenNthCalledWith(
				2,
				'The package name must match the "@[scope]/ckeditor5-[feature-name]" pattern.'
			);
		} );

		it( 'rejects the package name if it does not match to the ckeditor5-* pattern (missing "ckeditor5-" prefix)', () => {
			validatePackageName( stubs.logger, '@ckeditor/foo' );

			expect( process.exit ).toHaveBeenCalled();
			expect( stubs.logger.error ).toHaveBeenNthCalledWith(
				2,
				'The package name must match the "@[scope]/ckeditor5-[feature-name]" pattern.'
			);
		} );

		it( 'rejects the package name if it does not match to the ckeditor5-* pattern (missing hyphen-minus)', () => {
			validatePackageName( stubs.logger, '@ckeditor/ckeditor5_foo' );

			expect( process.exit ).toHaveBeenCalled();
			expect( stubs.logger.error ).toHaveBeenNthCalledWith(
				2,
				'The package name must match the "@[scope]/ckeditor5-[feature-name]" pattern.'
			);
		} );
	} );

	describe( 'verifying allowed characters', () => {
		it( 'rejects if the package name contains non-friendly URL characters - check ~', () => {
			validatePackageName( stubs.logger, '@ckeditor/ckeditor5-foo~foo' );

			expect( process.exit ).toHaveBeenCalled();
			expect( stubs.logger.error ).toHaveBeenNthCalledWith( 2, 'The package name contains non-allowed characters.' );
		} );

		it( 'rejects if the package name contains non-friendly URL characters - check \'', () => {
			validatePackageName( stubs.logger, '@ckeditor/ckeditor5-foo\'foo' );

			expect( process.exit ).toHaveBeenCalled();
			expect( stubs.logger.error ).toHaveBeenNthCalledWith( 2, 'The package name contains non-allowed characters.' );
		} );

		it( 'rejects if the package name contains non-friendly URL characters - check !', () => {
			validatePackageName( stubs.logger, '@ckeditor/ckeditor5-foo!foo' );

			expect( process.exit ).toHaveBeenCalled();
			expect( stubs.logger.error ).toHaveBeenNthCalledWith( 2, 'The package name contains non-allowed characters.' );
		} );

		it( 'rejects if the package name contains non-friendly URL characters - check (', () => {
			validatePackageName( stubs.logger, '@ckeditor/ckeditor5-foo(foo' );

			expect( process.exit ).toHaveBeenCalled();
			expect( stubs.logger.error ).toHaveBeenNthCalledWith( 2, 'The package name contains non-allowed characters.' );
		} );

		it( 'rejects if the package name contains non-friendly URL characters - check )', () => {
			validatePackageName( stubs.logger, '@ckeditor/ckeditor5-foo)foo' );

			expect( process.exit ).toHaveBeenCalled();
			expect( stubs.logger.error ).toHaveBeenNthCalledWith( 2, 'The package name contains non-allowed characters.' );
		} );

		it( 'rejects if the package name contains non-friendly URL characters - check *', () => {
			validatePackageName( stubs.logger, '@ckeditor/ckeditor5-foo*foo' );

			expect( process.exit ).toHaveBeenCalled();
			expect( stubs.logger.error ).toHaveBeenNthCalledWith( 2, 'The package name contains non-allowed characters.' );
		} );

		it( 'rejects if the scope contains non-alphanumeric characters', () => {
			validatePackageName( stubs.logger, '@ćkèditör/ckeditor5-foo' );

			expect( process.exit ).toHaveBeenCalled();
			expect( stubs.logger.error ).toHaveBeenNthCalledWith( 2, 'The package name contains non-allowed characters.' );
		} );

		it( 'rejects if the package name contains non-alphanumeric characters', () => {
			validatePackageName( stubs.logger, '@ckeditor/ckeditor5-fø' );

			expect( process.exit ).toHaveBeenCalled();
			expect( stubs.logger.error ).toHaveBeenNthCalledWith( 2, 'The package name contains non-allowed characters.' );
		} );
	} );

	it( 'returns null for a valid package name', () => {
		validatePackageName( stubs.logger, '@scope/ckeditor5-test-package' );

		expect( process.exit ).not.toHaveBeenCalled();
		expect( stubs.logger.error ).not.toHaveBeenCalled();
	} );
} );

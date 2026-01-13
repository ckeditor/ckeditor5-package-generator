/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import validatePackageName from '../../lib/utils/validate-package-name.js';
import inquirer from 'inquirer';

vi.mock( 'inquirer' );
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
		vi.mocked( inquirer.prompt ).mockImplementation( async args => ( { validPackageName: args.default } ) );

		stubs = {
			logger: {
				error: vi.fn(),
				info: vi.fn(),
				process: vi.fn()
			}
		};
	} );

	it( 'should be a function', async () => {
		expect( validatePackageName ).toBeTypeOf( 'function' );
	} );

	it( 'logs the process', async () => {
		await validatePackageName( stubs.logger, undefined );

		expect( stubs.logger.process ).toHaveBeenCalledTimes( 1 );
		expect( stubs.logger.process ).toHaveBeenCalledWith( 'Verifying the specified package name.' );
	} );

	it( 'logs info about correct package name format in case of incorrect name', async () => {
		await validatePackageName( stubs.logger, 'foo-bar' );

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

	it( 'should call inquirer.prompt when provided value is invalid', async () => {
		await validatePackageName( stubs.logger, undefined );

		expect( inquirer.prompt ).toHaveBeenCalled();
	} );

	it( 'should return new valid package name from inquirer.prompt when provided value is invalid', async () => {
		vi.mocked( inquirer.prompt ).mockImplementation( async () => ( { validPackageName: '@ckeditor/ckeditor5-valid-package-name' } ) );

		const validatedPackageName = await validatePackageName( stubs.logger, undefined );

		expect( validatedPackageName ).toEqual( '@ckeditor/ckeditor5-valid-package-name' );
	} );

	it( 'should call the validator function when calling prompt', async () => {
		await validatePackageName( stubs.logger, undefined );

		const validatorFn = vi.mocked( inquirer.prompt ).mock.calls[ 0 ][ 0 ].validate;

		expect( validatorFn( '@ckeditor/ckeditor5-foo' ) ).toEqual( true );
	} );

	it( 'should not call inquirer.prompt when provided value is valid', async () => {
		await validatePackageName( stubs.logger, '@ckeditor/ckeditor5-foo' );

		expect( inquirer.prompt ).not.toHaveBeenCalled();
	} );

	describe( 'verifying package name length', () => {
		it( 'rejects undefined value', async () => {
			await validatePackageName( stubs.logger, undefined );

			expect( stubs.logger.error ).toHaveBeenNthCalledWith(
				2,
				'The package name cannot be an empty string - pass the name as the first argument to the script.'
			);
		} );

		it( 'rejects an empty package name', async () => {
			await validatePackageName( stubs.logger, '' );

			expect( stubs.logger.error ).toHaveBeenNthCalledWith(
				2,
				'The package name cannot be an empty string - pass the name as the first argument to the script.'
			);
		} );

		it( 'accepts a name lesser than 214 characters', async () => {
			await validatePackageName( stubs.logger, '@ckeditor/ckeditor5-foo' );

			expect( stubs.logger.error ).not.toHaveBeenCalled();
		} );

		it( 'accepts the length of a name equal to 214', async () => {
			// 214 is a limit, 21 is the length of the string, the rest is "o".
			await validatePackageName( stubs.logger, '@ckeditor/ckeditor5-f' + 'o'.repeat( 193 ) );

			expect( stubs.logger.error ).not.toHaveBeenCalled();
		} );

		it( 'rejects a name longer than 214 characters', async () => {
			// 214 is a limit, 21 is the length of the string, the rest is "o". Add 1 to exceed the limit.
			await validatePackageName( stubs.logger, '@ckeditor/ckeditor5-f' + 'o'.repeat( 194 ) );

			expect( stubs.logger.error ).toHaveBeenNthCalledWith(
				2,
				'The length of the package name cannot be longer than 214 characters.'
			);
		} );
	} );

	describe( 'verifying capital letters', () => {
		it( 'rejects a package name if it contains at least a single capital letter', async () => {
			await validatePackageName( stubs.logger, '@ckeditor/ckeditor5-Foo' );

			expect( stubs.logger.error ).toHaveBeenNthCalledWith( 2, 'The package name cannot contain capital letters.' );
		} );
	} );

	describe( 'verifying compliance with the pattern', () => {
		it( 'rejects the package name without a scope', async () => {
			await validatePackageName( stubs.logger, 'ckeditor5-foo' );

			expect( stubs.logger.error ).toHaveBeenNthCalledWith(
				2,
				'The package name must match the "@[scope]/ckeditor5-[feature-name]" pattern.'
			);
		} );

		it( 'rejects the package name if the scope misses the "at" (@) character at the beginning', async () => {
			await validatePackageName( stubs.logger, 'ckeditor/ckeditor5-foo' );

			expect( stubs.logger.error ).toHaveBeenNthCalledWith(
				2,
				'The package name must match the "@[scope]/ckeditor5-[feature-name]" pattern.'
			);
		} );

		it( 'rejects the package name if the name ends with the slash (/)', async () => {
			await validatePackageName( stubs.logger, '@ckeditor/ckeditor5-foo/' );

			expect( stubs.logger.error ).toHaveBeenNthCalledWith(
				2,
				'The package name must match the "@[scope]/ckeditor5-[feature-name]" pattern.'
			);
		} );

		it( 'rejects the package name if it does not match to the ckeditor5-* pattern (missing "ckeditor5-" prefix)', async () => {
			await validatePackageName( stubs.logger, '@ckeditor/foo' );

			expect( stubs.logger.error ).toHaveBeenNthCalledWith(
				2,
				'The package name must match the "@[scope]/ckeditor5-[feature-name]" pattern.'
			);
		} );

		it( 'rejects the package name if it does not match to the ckeditor5-* pattern (missing hyphen-minus)', async () => {
			await validatePackageName( stubs.logger, '@ckeditor/ckeditor5_foo' );

			expect( stubs.logger.error ).toHaveBeenNthCalledWith(
				2,
				'The package name must match the "@[scope]/ckeditor5-[feature-name]" pattern.'
			);
		} );
	} );

	describe( 'verifying allowed characters', () => {
		it( 'rejects if the package name contains non-friendly URL characters - check ~', async () => {
			await validatePackageName( stubs.logger, '@ckeditor/ckeditor5-foo~foo' );

			expect( stubs.logger.error ).toHaveBeenNthCalledWith( 2, 'The package name contains non-allowed characters.' );
		} );

		it( 'rejects if the package name contains non-friendly URL characters - check \'', async () => {
			await validatePackageName( stubs.logger, '@ckeditor/ckeditor5-foo\'foo' );

			expect( stubs.logger.error ).toHaveBeenNthCalledWith( 2, 'The package name contains non-allowed characters.' );
		} );

		it( 'rejects if the package name contains non-friendly URL characters - check !', async () => {
			await validatePackageName( stubs.logger, '@ckeditor/ckeditor5-foo!foo' );

			expect( stubs.logger.error ).toHaveBeenNthCalledWith( 2, 'The package name contains non-allowed characters.' );
		} );

		it( 'rejects if the package name contains non-friendly URL characters - check (', async () => {
			await validatePackageName( stubs.logger, '@ckeditor/ckeditor5-foo(foo' );

			expect( stubs.logger.error ).toHaveBeenNthCalledWith( 2, 'The package name contains non-allowed characters.' );
		} );

		it( 'rejects if the package name contains non-friendly URL characters - check )', async () => {
			await validatePackageName( stubs.logger, '@ckeditor/ckeditor5-foo)foo' );

			expect( stubs.logger.error ).toHaveBeenNthCalledWith( 2, 'The package name contains non-allowed characters.' );
		} );

		it( 'rejects if the package name contains non-friendly URL characters - check *', async () => {
			await validatePackageName( stubs.logger, '@ckeditor/ckeditor5-foo*foo' );

			expect( stubs.logger.error ).toHaveBeenNthCalledWith( 2, 'The package name contains non-allowed characters.' );
		} );

		it( 'rejects if the scope contains non-alphanumeric characters', async () => {
			await validatePackageName( stubs.logger, '@ćkèditör/ckeditor5-foo' );

			expect( stubs.logger.error ).toHaveBeenNthCalledWith( 2, 'The package name contains non-allowed characters.' );
		} );

		it( 'rejects if the package name contains non-alphanumeric characters', async () => {
			await validatePackageName( stubs.logger, '@ckeditor/ckeditor5-fø' );

			expect( stubs.logger.error ).toHaveBeenNthCalledWith( 2, 'The package name contains non-allowed characters.' );
		} );
	} );

	it( 'returns the packageName for a valid package name', async () => {
		const validatedPackageName = await validatePackageName( stubs.logger, '@scope/ckeditor5-test-package' );

		expect( validatedPackageName ).toEqual( '@scope/ckeditor5-test-package' );
	} );
} );

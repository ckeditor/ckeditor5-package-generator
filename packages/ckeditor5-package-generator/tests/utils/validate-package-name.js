/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { promptText, showNote } from '../../lib/utils/prompt.js';
import validatePackageName from '../../lib/utils/validate-package-name.js';

vi.mock( '../../lib/utils/prompt.js' );
vi.mock( 'chalk', () => ( {
	default: {
		green: vi.fn( str => str ),
		blue: vi.fn( str => str )
	}
} ) );

describe( 'lib/utils/validate-package-name', () => {
	let stubs;

	beforeEach( () => {
		vi.mocked( promptText ).mockImplementation( async options => options.initialValue || 'ckeditor5-valid-package' );

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

	it( 'shows a note and prompts when the package name is missing', async () => {
		const validatedPackageName = await validatePackageName( stubs.logger, undefined );

		expect( validatedPackageName ).toEqual( 'ckeditor5-valid-package' );
		expect( showNote ).toHaveBeenCalledTimes( 1 );
		expect( showNote ).toHaveBeenCalledWith(
			expect.stringContaining( 'Choose a package name to get started.' ),
			'Package name'
		);
		expect( showNote ).toHaveBeenCalledWith(
			expect.stringContaining( '@[scope]/ckeditor5-[feature-name]' ),
			'Package name'
		);
		expect( showNote ).toHaveBeenCalledWith(
			expect.stringContaining( 'ckeditor5-[feature-name]' ),
			'Package name'
		);
		expect( promptText ).toHaveBeenCalledWith( {
			message: 'Package name',
			placeholder: '@scope/ckeditor5-my-feature',
			initialValue: undefined,
			validate: expect.any( Function )
		} );
		expect( stubs.logger.error ).not.toHaveBeenCalled();
	} );

	it( 'shows a note and prompts when the provided package name is invalid', async () => {
		await validatePackageName( stubs.logger, 'foo-bar' );

		expect( showNote ).toHaveBeenCalledWith(
			expect.stringContaining(
				'The package name must match the "ckeditor5-[feature-name]" or "@[scope]/ckeditor5-[feature-name]" pattern.'
			),
			'Package name'
		);
		expect( promptText ).toHaveBeenCalledWith( expect.objectContaining( {
			initialValue: 'foo-bar'
		} ) );
		expect( stubs.logger.error ).not.toHaveBeenCalled();
	} );

	it( 'does not prompt when the provided scoped package name is valid', async () => {
		const validatedPackageName = await validatePackageName( stubs.logger, '@ckeditor/ckeditor5-foo' );

		expect( validatedPackageName ).toEqual( '@ckeditor/ckeditor5-foo' );
		expect( promptText ).not.toHaveBeenCalled();
		expect( showNote ).not.toHaveBeenCalled();
	} );

	it( 'does not prompt when the provided unscoped package name is valid', async () => {
		const validatedPackageName = await validatePackageName( stubs.logger, 'ckeditor5-foo' );

		expect( validatedPackageName ).toEqual( 'ckeditor5-foo' );
		expect( promptText ).not.toHaveBeenCalled();
		expect( showNote ).not.toHaveBeenCalled();
	} );

	describe( 'prompt validator', () => {
		it( 'accepts both scoped and unscoped package names', async () => {
			await validatePackageName( stubs.logger, undefined );

			const validator = vi.mocked( promptText ).mock.calls[ 0 ][ 0 ].validate;

			expect( validator( '@ckeditor/ckeditor5-foo' ) ).toBeUndefined();
			expect( validator( 'ckeditor5-foo' ) ).toBeUndefined();
		} );

		it( 'rejects empty values', async () => {
			await validatePackageName( stubs.logger, undefined );

			const validator = vi.mocked( promptText ).mock.calls[ 0 ][ 0 ].validate;

			expect( validator( '' ) ).toEqual( 'The package name cannot be empty.' );
		} );

		it( 'rejects capital letters', async () => {
			await validatePackageName( stubs.logger, undefined );

			const validator = vi.mocked( promptText ).mock.calls[ 0 ][ 0 ].validate;

			expect( validator( 'ckeditor5-Foo' ) ).toEqual( 'The package name cannot contain capital letters.' );
		} );

		it( 'rejects names longer than 214 characters', async () => {
			await validatePackageName( stubs.logger, undefined );

			const validator = vi.mocked( promptText ).mock.calls[ 0 ][ 0 ].validate;

			expect( validator( 'ckeditor5-f' + 'o'.repeat( 204 ) ) ).toEqual(
				'The length of the package name cannot be longer than 214 characters.'
			);
		} );

		it( 'rejects invalid patterns', async () => {
			await validatePackageName( stubs.logger, undefined );

			const validator = vi.mocked( promptText ).mock.calls[ 0 ][ 0 ].validate;

			expect( validator( '@ckeditor/foo' ) ).toEqual(
				'The package name must match the "ckeditor5-[feature-name]" or "@[scope]/ckeditor5-[feature-name]" pattern.'
			);
		} );

		it( 'rejects non-allowed characters', async () => {
			await validatePackageName( stubs.logger, undefined );

			const validator = vi.mocked( promptText ).mock.calls[ 0 ][ 0 ].validate;

			expect( validator( 'ckeditor5-f~oo' ) ).toEqual( 'The package name contains non-allowed characters.' );
			expect( validator( '@ćkèditör/ckeditor5-foo' ) ).toEqual( 'The package name contains non-allowed characters.' );
		} );
	} );
} );

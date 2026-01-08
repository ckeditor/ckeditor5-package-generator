/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import validateGlobalName from '../../lib/utils/validate-global-name.js';
import setGlobalName from '../../lib/utils/set-global-name.js';
import promptWithErrorHandling from '../../lib/utils/prompt-with-error-handling.js';

vi.mock( '../../lib/utils/prompt-with-error-handling.js' );
vi.mock( '../../lib/utils/validate-global-name.js' );

describe( 'lib/utils/set-global-name', () => {
	let stubs;

	beforeEach( () => {
		vi.mocked( promptWithErrorHandling ).mockResolvedValue( 'GLOBAL' );
		vi.mocked( validateGlobalName ).mockReturnValue( true );

		stubs = {
			logger: {
				error: vi.fn()
			}
		};
	} );

	it( 'should be a function', () => {
		expect( setGlobalName ).toBeTypeOf( 'function' );
	} );

	it( 'calls prompt() with correct arguments', async () => {
		await setGlobalName( stubs.logger, '', 'CKCustomPlugin' );

		expect( promptWithErrorHandling ).toHaveBeenCalledTimes( 1 );
		expect( promptWithErrorHandling ).toHaveBeenCalledWith( {
			required: true,
			message: 'Enter the global name for UMD build:',
			type: 'input',
			name: 'globalName',
			validate: expect.any( Function ),
			default: 'CKCustomPlugin'
		} );
	} );

	it( 'returns correct value when user input "GLOBAL"', async () => {
		const result = await setGlobalName( stubs.logger, 'GLOBAL' );

		expect( result ).toEqual( 'GLOBAL' );
	} );

	it( 'falls back to user input when global name has invalid value', async () => {
		vi.mocked( validateGlobalName ).mockReturnValue( false );

		const result = await setGlobalName( stubs.logger, '1234foobar' );

		expect( result ).toEqual( undefined );

		expect( promptWithErrorHandling ).toHaveBeenCalledTimes( 1 );

		expect( stubs.logger.error ).toHaveBeenCalledTimes( 1 );
		expect( stubs.logger.error ).toHaveBeenCalledWith( '--global-name does not match the pattern. Falling back to manual choice.' );
	} );
} );

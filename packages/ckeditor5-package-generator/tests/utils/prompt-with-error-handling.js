/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import inquirer from 'inquirer';
import promptWithErrorHandling from '../../lib/utils/prompt-with-error-handling.js';

vi.mock( 'inquirer' );

describe( 'lib/utils/prompt-with-error-handling', () => {
	beforeEach( () => {
		vi.spyOn( process, 'exit' ).mockImplementation( () => {} );

		vi.mocked( inquirer.prompt ).mockResolvedValue( {} );
	} );

	it( 'should call process.exit on SIGINT error', async () => {
		vi.mocked( inquirer.prompt ).mockRejectedValue( new Error( 'SIGINT' ) );

		await promptWithErrorHandling();

		expect( process.exit ).toHaveBeenCalledWith( 1 );
	} );

	it( 'should rethrow error on error other than SIGINT', async () => {
		vi.mocked( inquirer.prompt ).mockRejectedValue( new Error( 'Other error' ) );

		await expect( promptWithErrorHandling ).rejects.toThrow( 'Other error' );

		expect( process.exit ).not.toHaveBeenCalled();
	} );

	it( 'should call inquirer.prompt with correct arguments', async () => {
		const mockOptions = {
			prefix: '📍',
			name: 'programmingLanguage',
			message: 'Choose your programming language:',
			type: 'list'
		};

		await promptWithErrorHandling( mockOptions );

		expect( inquirer.prompt ).toHaveBeenCalledWith( mockOptions );
	} );
} );

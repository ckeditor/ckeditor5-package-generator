/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import inquirer from 'inquirer';
import chooseProgrammingLanguage from '../../lib/utils/choose-programming-language.js';

vi.mock( 'inquirer' );

describe( 'lib/utils/choose-programming-language', () => {
	beforeEach( () => {
		vi.mocked( inquirer.prompt ).mockResolvedValue( { programmingLanguage: 'JavaScript' } );
	} );

	it( 'should be a function', () => {
		expect( chooseProgrammingLanguage ).toBeTypeOf( 'function' );
	} );

	it( 'calls prompt() with correct arguments', async () => {
		await chooseProgrammingLanguage( vi.fn() );

		expect( inquirer.prompt ).toHaveBeenCalledTimes( 1 );
		expect( inquirer.prompt ).toHaveBeenCalledWith( [ {
			prefix: '📍',
			name: 'programmingLanguage',
			message: 'Choose your programming language:',
			type: 'list',
			choices: [ 'TypeScript', 'JavaScript' ]
		} ] );
	} );

	it( 'returns correct value when user picks JavaScript', async () => {
		const result = await chooseProgrammingLanguage( vi.fn() );

		expect( result ).toEqual( 'js' );
	} );

	it( 'returns correct value when user picks TypeScript', async () => {
		vi.mocked( inquirer.prompt ).mockResolvedValue( { programmingLanguage: 'TypeScript' } );

		const result = await chooseProgrammingLanguage( vi.fn() );

		expect( result ).toEqual( 'ts' );
	} );

	it( 'returns lang option if it defines a supported value', async () => {
		const result = await chooseProgrammingLanguage( vi.fn(), 'ts' );

		expect( result ).toEqual( 'ts' );

		expect( inquirer.prompt ).not.toHaveBeenCalled();
	} );

	it( 'falls back to user input when lang option has invalid value', async () => {
		const logger = {
			error: vi.fn()
		};

		vi.mocked( inquirer.prompt ).mockResolvedValue( { programmingLanguage: 'TypeScript' } );

		const result = await chooseProgrammingLanguage( logger, 'python' );

		expect( result ).toEqual( 'ts' );

		expect( inquirer.prompt ).toHaveBeenCalledTimes( 1 );
		expect( logger.error ).toHaveBeenCalledTimes( 1 );
	} );
} );

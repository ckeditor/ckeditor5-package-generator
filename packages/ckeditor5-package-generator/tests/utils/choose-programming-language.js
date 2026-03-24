/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { promptSelect } from '../../lib/utils/prompt.js';
import chooseProgrammingLanguage from '../../lib/utils/choose-programming-language.js';

vi.mock( '../../lib/utils/prompt.js' );

describe( 'lib/utils/choose-programming-language', () => {
	beforeEach( () => {
		vi.mocked( promptSelect ).mockResolvedValue( 'js' );
	} );

	it( 'should be a function', () => {
		expect( chooseProgrammingLanguage ).toBeTypeOf( 'function' );
	} );

	it( 'calls promptSelect() with correct arguments', async () => {
		await chooseProgrammingLanguage( { info: vi.fn() } );

		expect( promptSelect ).toHaveBeenCalledTimes( 1 );
		expect( promptSelect ).toHaveBeenCalledWith( {
			message: 'Programming language',
			initialValue: 'ts',
			options: [
				{ value: 'ts', label: 'TypeScript' },
				{ value: 'js', label: 'JavaScript' }
			]
		} );
	} );

	it( 'returns the selected language', async () => {
		const result = await chooseProgrammingLanguage( { info: vi.fn() } );

		expect( result ).toEqual( 'js' );
	} );

	it( 'returns the lang option if it defines a supported value', async () => {
		const result = await chooseProgrammingLanguage( { info: vi.fn() }, 'ts' );

		expect( result ).toEqual( 'ts' );
		expect( promptSelect ).not.toHaveBeenCalled();
	} );

	it( 'falls back to the prompt when lang option has invalid value', async () => {
		const logger = {
			info: vi.fn()
		};

		vi.mocked( promptSelect ).mockResolvedValue( 'ts' );

		const result = await chooseProgrammingLanguage( logger, 'python' );

		expect( result ).toEqual( 'ts' );
		expect( promptSelect ).toHaveBeenCalledTimes( 1 );
		expect( logger.info ).toHaveBeenCalledTimes( 1 );
		expect( logger.info ).toHaveBeenCalledWith( 'The provided language "python" is not supported. Choose one of: ts, js.' );
	} );
} );

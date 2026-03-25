/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { promptText, showNote } from '../../lib/utils/prompt.js';
import validatePluginName from '../../lib/utils/validate-plugin-name.js';

vi.mock( '../../lib/utils/prompt.js' );

describe( 'lib/utils/validate-plugin-name', () => {
	beforeEach( () => {
		vi.mocked( promptText ).mockResolvedValue( 'FooBar' );
	} );

	it( 'should be a function', () => {
		expect( validatePluginName ).toBeTypeOf( 'function' );
	} );

	it( 'does nothing if the plugin name is not provided', async () => {
		const validatedPluginName = await validatePluginName();

		expect( validatedPluginName ).toBeUndefined();
		expect( showNote ).not.toHaveBeenCalled();
		expect( promptText ).not.toHaveBeenCalled();
	} );

	it( 'returns the plugin name when it is valid', async () => {
		const validatedPluginName = await validatePluginName( 'FooBar' );

		expect( validatedPluginName ).toEqual( 'FooBar' );
		expect( showNote ).not.toHaveBeenCalled();
		expect( promptText ).not.toHaveBeenCalled();
	} );

	it( 'shows a note and prompts when the provided plugin name is invalid', async () => {
		await validatePluginName( '#abc' );

		expect( showNote ).toHaveBeenCalledWith(
			expect.stringContaining( 'The plugin name contains non-allowed characters.' ),
			'Plugin name'
		);
		expect( promptText ).toHaveBeenCalledWith( {
			message: 'Plugin class name (optional)',
			placeholder: 'MyPlugin',
			initialValue: '#abc',
			validate: expect.any( Function )
		} );
	} );

	it( 'allows clearing the custom plugin name during the prompt', async () => {
		vi.mocked( promptText ).mockResolvedValue( '' );

		const validatedPluginName = await validatePluginName( '#abc' );

		expect( validatedPluginName ).toBeUndefined();
	} );

	it( 'prompt validator accepts empty and valid values', async () => {
		await validatePluginName( '#abc' );

		const validator = vi.mocked( promptText ).mock.calls[ 0 ][ 0 ].validate;

		expect( validator( '' ) ).toBeUndefined();
		expect( validator( 'FooBar' ) ).toBeUndefined();
	} );

	it( 'prompt validator rejects invalid values', async () => {
		await validatePluginName( '#abc' );

		const validator = vi.mocked( promptText ).mock.calls[ 0 ][ 0 ].validate;

		expect( validator( '#abc' ) ).toEqual( 'The plugin name contains non-allowed characters.' );
		expect( validator( '9Abc' ) ).toEqual( 'The plugin name can not start with a digit.' );
	} );
} );

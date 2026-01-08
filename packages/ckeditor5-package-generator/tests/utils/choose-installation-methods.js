/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import chooseInstallationMethods from '../../lib/utils/choose-installation-methods.js';
import promptWithErrorHandling from '../../lib/utils/prompt-with-error-handling.js';

vi.mock( '../../lib/utils/prompt-with-error-handling.js' );

describe( 'lib/utils/choose-installation-methods', () => {
	const INSTALLATION_METHODS = [
		{
			value: 'current',
			displayName: 'Current (v42.0.0+) [recommended]'
		},
		{
			value: 'current-and-legacy',
			displayName: 'Current and legacy methods with DLLs (pre-42.0.0). [⚠️ Requires additional work with imports. ' +
				'See: https://ckeditor.com/docs/ckeditor5/latest/framework/tutorials/supporting-multiple-versions.html]'
		}
	];

	beforeEach( () => {
		vi.mocked( promptWithErrorHandling ).mockResolvedValue( { installationMethod: INSTALLATION_METHODS[ 0 ].displayName } );
	} );

	it( 'should be a function', () => {
		expect( chooseInstallationMethods ).toBeTypeOf( 'function' );
	} );

	it( 'calls prompt() with correct arguments', async () => {
		await chooseInstallationMethods( vi.fn() );

		expect( promptWithErrorHandling ).toHaveBeenCalledTimes( 1 );
		expect( promptWithErrorHandling ).toHaveBeenCalledWith( [ {
			prefix: '📍',
			name: 'installationMethod',
			message: 'Which installation methods of CKEditor 5 do you want to support?',
			type: 'list',
			choices: INSTALLATION_METHODS.map( ( { displayName } ) => displayName )
		} ] );
	} );

	it( 'returns correct value when user picks "Current"', async () => {
		const result = await chooseInstallationMethods( vi.fn() );

		expect( result ).toEqual( 'current' );
	} );

	it( 'returns correct value when user picks "Current and legacy methods with DLLs"', async () => {
		vi.mocked( promptWithErrorHandling ).mockResolvedValue( { installationMethod: INSTALLATION_METHODS[ 1 ].displayName } );

		const result = await chooseInstallationMethods( vi.fn() );

		expect( result ).toEqual( 'current-and-legacy' );
	} );

	it( 'returns installation method option if it defines a supported value', async () => {
		const result = await chooseInstallationMethods( vi.fn(), 'current' );

		expect( result ).toEqual( 'current' );

		expect( promptWithErrorHandling ).not.toHaveBeenCalled();
	} );

	it( 'falls back to user input when installation method option has invalid value', async () => {
		const logger = {
			error: vi.fn()
		};

		vi.mocked( promptWithErrorHandling ).mockResolvedValue( { installationMethod: INSTALLATION_METHODS[ 1 ].displayName } );

		const result = await chooseInstallationMethods( logger, 'foobar' );

		expect( result ).toEqual( 'current-and-legacy' );

		expect( promptWithErrorHandling ).toHaveBeenCalledTimes( 1 );
		expect( logger.error ).toHaveBeenCalledTimes( 1 );
	} );
} );

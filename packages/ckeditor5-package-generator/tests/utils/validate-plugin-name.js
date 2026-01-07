/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import validatePluginName from '../../lib/utils/validate-plugin-name.js';

vi.mock( 'chalk', () => ( {
	default: {
		red: vi.fn( str => str ),
		blue: vi.fn( str => str )
	}
} ) );

describe( 'lib/utils/validate-plugin-name', () => {
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
		expect( validatePluginName ).toBeTypeOf( 'function' );
	} );

	it( 'does nothing if the plugin name is not provided', () => {
		validatePluginName( stubs.logger );

		expect( stubs.logger.process ).not.toHaveBeenCalled();
		expect( stubs.logger.error ).not.toHaveBeenCalled();
		expect( stubs.logger.info ).not.toHaveBeenCalled();
		expect( process.exit ).not.toHaveBeenCalled();
	} );

	it( 'logs the process if the plugin name is provided', () => {
		validatePluginName( stubs.logger, 'Foo' );

		expect( stubs.logger.process ).toHaveBeenCalledTimes( 1 );
		expect( stubs.logger.process ).toHaveBeenCalledWith( 'Verifying the specified plugin name.' );
	} );

	it( 'logs info about correct plugin name format in case of incorrect name', () => {
		validatePluginName( stubs.logger, '#abc' );

		expect( stubs.logger.error ).toHaveBeenCalledTimes( 2 );
		expect( stubs.logger.error ).toHaveBeenNthCalledWith(
			1,
			'❗ Found an error while verifying the provided plugin name:',
			{ startWithNewLine: true }
		);

		expect( stubs.logger.info ).toHaveBeenCalledTimes( 2 );
		expect( stubs.logger.info ).toHaveBeenNthCalledWith( 1, 'The provided plugin name:    #abc' );
		expect( stubs.logger.info ).toHaveBeenNthCalledWith( 2, 'Allowed characters list:     0-9 A-Z a-z' );
	} );

	it( 'rejects plugin names containing non-allowed characters', () => {
		validatePluginName( stubs.logger, '#abc' );

		expect( process.exit ).toHaveBeenCalled();
		expect( stubs.logger.error ).toHaveBeenNthCalledWith( 2, 'The plugin name contains non-allowed characters.' );
	} );

	it( 'rejects plugin names that do not start with a letter', () => {
		validatePluginName( stubs.logger, '9Abc' );

		expect( process.exit ).toHaveBeenCalled();
		expect( stubs.logger.error ).toHaveBeenNthCalledWith( 2, 'The plugin name can not start with a digit.' );
	} );

	it( 'accepts plugin names that only contain letters', () => {
		validatePluginName( stubs.logger, 'FooBar' );

		expect( process.exit ).not.toHaveBeenCalled();
		expect( stubs.logger.error ).not.toHaveBeenCalled();
	} );

	it( 'accepts plugin names that contain a number', () => {
		validatePluginName( stubs.logger, 'Foo9bar' );

		expect( process.exit ).not.toHaveBeenCalled();
		expect( stubs.logger.error ).not.toHaveBeenCalled();
	} );
} );

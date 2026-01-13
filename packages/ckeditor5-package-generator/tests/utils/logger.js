/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi } from 'vitest';
import Logger from '../../lib/utils/logger.js';

vi.stubGlobal( 'console', {
	log: vi.fn()
} );

vi.mock( 'chalk', () => ( {
	default: {
		red: vi.fn( str => `red:[${ str }]` ),
		gray: vi.fn( str => `gray:[${ str }]` ),
		italic: vi.fn( str => `italic:[${ str }]` )
	}
} ) );

describe( 'lib/utils/logger', () => {
	it( 'should be a function', () => {
		expect( Logger ).toBeTypeOf( 'function' );
	} );

	describe( 'process()', () => {
		it( 'calls the _genericLog() with correct arguments', () => {
			const logger = new Logger( true );

			vi.spyOn( logger, '_genericLog' ).mockImplementation( () => {} );

			logger.process( 'Executing the task...', { startWithNewLine: true } );

			expect( console.log ).not.toHaveBeenCalled();
			expect( logger._genericLog ).toHaveBeenCalledTimes( 1 );
			expect( logger._genericLog ).toHaveBeenCalledWith( '📍 Executing the task...', { startWithNewLine: true } );
		} );
	} );

	describe( 'info()', () => {
		it( 'calls the _genericLog() with correct arguments', () => {
			const logger = new Logger( true );

			vi.spyOn( logger, '_genericLog' ).mockImplementation( () => {} );

			logger.info( 'Logging some information...', { startWithNewLine: false } );

			expect( console.log ).not.toHaveBeenCalled();
			expect( logger._genericLog ).toHaveBeenCalledTimes( 1 );
			expect( logger._genericLog ).toHaveBeenCalledWith( 'Logging some information...', { startWithNewLine: false } );
		} );
	} );

	describe( 'verboseInfo()', () => {
		it( 'calls the _genericLog() with correct arguments', () => {
			const logger = new Logger( true );

			vi.spyOn( logger, '_genericLog' ).mockImplementation( () => {} );

			logger.verboseInfo( 'Logging some information...', { startWithNewLine: true } );

			expect( console.log ).not.toHaveBeenCalled();
			expect( logger._genericLog ).toHaveBeenCalledTimes( 1 );
			expect( logger._genericLog ).toHaveBeenCalledWith( 'gray:[italic:[Logging some information...]]', { startWithNewLine: true } );
		} );

		it( 'does nothing if logger instance was created in non-verbose mode', () => {
			const logger = new Logger( false );

			vi.spyOn( logger, '_genericLog' ).mockImplementation( () => {} );

			logger.verboseInfo( 'Logging some information...', { startWithNewLine: true } );

			expect( console.log ).not.toHaveBeenCalled();
			expect( logger._genericLog ).not.toHaveBeenCalled();
		} );
	} );

	describe( 'error()', () => {
		it( 'calls the _genericLog() with correct arguments', () => {
			const logger = new Logger( true );

			vi.spyOn( logger, '_genericLog' ).mockImplementation( () => {} );

			logger.error( 'Logging some error...', { startWithNewLine: false } );

			expect( console.log ).not.toHaveBeenCalled();
			expect( logger._genericLog ).toHaveBeenCalledTimes( 1 );
			expect( logger._genericLog ).toHaveBeenCalledWith( 'red:[Logging some error...]', { startWithNewLine: false } );
		} );
	} );

	describe( '_genericLog()', () => {
		it( 'prints the message', () => {
			const logger = new Logger( true );

			logger._genericLog( 'The message', { startWithNewLine: false } );

			expect( console.log ).toHaveBeenCalledTimes( 1 );
			expect( console.log ).toHaveBeenCalledWith( 'The message' );
		} );

		it( 'prints empty line before the message if startWithNewLine option is true', () => {
			const logger = new Logger( true );

			logger._genericLog( 'The message', { startWithNewLine: true } );

			expect( console.log ).toHaveBeenCalledTimes( 2 );
			expect( console.log ).toHaveBeenNthCalledWith( 1 );
			expect( console.log ).toHaveBeenNthCalledWith( 2, 'The message' );
		} );

		it( 'prints the message when no options were passed', () => {
			const logger = new Logger( true );

			logger._genericLog( 'The message' );

			expect( console.log ).toHaveBeenCalledTimes( 1 );
			expect( console.log ).toHaveBeenCalledWith( 'The message' );
		} );
	} );
} );

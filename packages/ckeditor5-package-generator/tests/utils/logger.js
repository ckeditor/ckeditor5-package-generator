/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

const mockery = require( 'mockery' );
const sinon = require( 'sinon' );
const { expect } = require( 'chai' );

describe( 'lib/utils/logger', () => {
	let stubs,
		Logger;

	beforeEach( () => {
		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

		stubs = {
			chalk: {
				red: sinon.stub().callsFake( str => `red:[${ str }]` )
			},
			console: {
				log: sinon.stub( console, 'log' )
			},
			_genericLog: sinon.stub()
		};

		mockery.registerMock( 'chalk', stubs.chalk );

		Logger = require( '../../lib/utils/logger' );
	} );

	afterEach( () => {
		mockery.deregisterAll();
		mockery.disable();
		sinon.restore();
	} );

	it( 'should be a function', () => {
		expect( Logger ).to.be.a( 'function' );
	} );

	describe( 'process()', () => {
		it( 'calls the _genericLog() with correct arguments', () => {
			const logger = new Logger( true );
			logger._genericLog = stubs._genericLog;

			logger.process( 'Executing the task...', { startWithNewLine: true } );

			expect( stubs.console.log.callCount ).to.equal( 0 );
			expect( stubs._genericLog.callCount ).to.equal( 1 );
			expect( stubs._genericLog.getCall( 0 ).args ).to.deep.equal( [
				'📍 Executing the task...',
				{ startWithNewLine: true }
			] );
		} );
	} );

	describe( 'info()', () => {
		it( 'calls the _genericLog() with correct arguments', () => {
			const logger = new Logger( true );
			logger._genericLog = stubs._genericLog;

			logger.info( 'Logging some information...', { startWithNewLine: false } );

			expect( stubs.console.log.callCount ).to.equal( 0 );
			expect( stubs._genericLog.callCount ).to.equal( 1 );
			expect( stubs._genericLog.getCall( 0 ).args ).to.deep.equal( [
				'Logging some information...',
				{ startWithNewLine: false }
			] );
		} );
	} );

	describe( 'verboseInfo()', () => {
		it( 'calls the _genericLog() with correct arguments', () => {
			const logger = new Logger( true );
			logger._genericLog = stubs._genericLog;

			logger.verboseInfo( 'Logging some information...', { startWithNewLine: true } );

			expect( stubs.console.log.callCount ).to.equal( 0 );
			expect( stubs._genericLog.callCount ).to.equal( 1 );
			expect( stubs._genericLog.getCall( 0 ).args ).to.deep.equal( [
				'Logging some information...',
				{ startWithNewLine: true }
			] );
		} );

		it( 'does nothing if logger instance was created in non-verbose mode', () => {
			const logger = new Logger( false );
			logger._genericLog = stubs._genericLog;

			logger.verboseInfo( 'Logging some information...', { startWithNewLine: true } );

			expect( stubs.console.log.callCount ).to.equal( 0 );
			expect( stubs._genericLog.callCount ).to.equal( 0 );
		} );
	} );

	describe( 'error()', () => {
		it( 'calls the _genericLog() with correct arguments', () => {
			const logger = new Logger( true );
			logger._genericLog = stubs._genericLog;

			logger.error( 'Logging some error...', { startWithNewLine: false } );

			expect( stubs.console.log.callCount ).to.equal( 0 );
			expect( stubs._genericLog.callCount ).to.equal( 1 );
			expect( stubs._genericLog.getCall( 0 ).args ).to.deep.equal( [
				'red:[Logging some error...]',
				{ startWithNewLine: false }
			] );
		} );
	} );

	describe( '_genericLog()', () => {
		it( 'prints the message', () => {
			const logger = new Logger( true );

			logger._genericLog( 'The message', { startWithNewLine: false } );

			expect( stubs.console.log.callCount ).to.equal( 1 );
			expect( stubs.console.log.getCall( 0 ).args[ 0 ] ).to.equal( 'The message' );
		} );

		it( 'prints empty line before the message if startWithNewLine option is true', () => {
			const logger = new Logger( true );

			logger._genericLog( 'The message', { startWithNewLine: true } );

			expect( stubs.console.log.callCount ).to.equal( 2 );
			expect( stubs.console.log.getCall( 0 ).args[ 0 ] ).to.equal();
			expect( stubs.console.log.getCall( 1 ).args[ 0 ] ).to.equal( 'The message' );
		} );

		it( 'prints the message when no options were passed', () => {
			const logger = new Logger( true );

			logger._genericLog( 'The message' );

			expect( stubs.console.log.callCount ).to.equal( 1 );
			expect( stubs.console.log.getCall( 0 ).args[ 0 ] ).to.equal( 'The message' );
		} );
	} );
} );

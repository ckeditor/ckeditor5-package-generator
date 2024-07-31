/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const mockery = require( 'mockery' );
const sinon = require( 'sinon' );
const { expect } = require( 'chai' );

describe( 'lib/utils/validate-global-name', () => {
	let stubs, validateGlobalName;

	beforeEach( () => {
		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

		stubs = {
			logger: {
				process: sinon.stub(),
				error: sinon.stub(),
				info: sinon.stub()
			},
			process: {
				exit: sinon.stub( process, 'exit' )
			},
			chalk: {
				red: sinon.stub().callsFake( str => str ),
				blue: sinon.stub().callsFake( str => str )
			}
		};

		mockery.registerMock( 'chalk', stubs.chalk );

		validateGlobalName = require( '../../lib/utils/validate-global-name' );
	} );

	afterEach( () => {
		mockery.deregisterAll();
		sinon.restore();
	} );

	it( 'should be a function', () => {
		expect( validateGlobalName ).to.be.an( 'function' );
	} );

	it( 'does nothing if the global name is not provided', () => {
		validateGlobalName( stubs.logger );

		expect( stubs.logger.process.called ).to.equal( false );
		expect( stubs.logger.error.called ).to.equal( false );
		expect( stubs.logger.info.called ).to.equal( false );
		expect( stubs.process.exit.called ).to.equal( false );
	} );

	it( 'Returns `true` if the plugin name is provided and it passed the validation', () => {
		const result = validateGlobalName( stubs.logger, 'Foo' );

		expect( result ).to.equal( true );
	} );

	it( 'logs info about incorrect global name format', () => {
		validateGlobalName( stubs.logger, '#abc' );

		expect( stubs.logger.error.calledTwice ).to.equal( true );
		expect( stubs.logger.error.getCall( 0 ).firstArg ).to.equal( '❗ Found an error while verifying the provided global name:' );
		expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal( 'The global name contains non-allowed characters.' );

		expect( stubs.logger.info.calledTwice ).to.equal( true );
		expect( stubs.logger.info.getCall( 0 ).firstArg ).to.equal( 'The provided global name:    #abc' );
		expect( stubs.logger.info.getCall( 1 ).firstArg ).to.equal( 'Allowed characters list:     0-9 A-Z a-z _ - / @' );
	} );

	it( 'logs info about incorrect global name format when it\'s not starts with a letter', () => {
		validateGlobalName( stubs.logger, '9Abc' );

		expect( stubs.logger.error.calledTwice ).to.equal( true );
		expect( stubs.logger.error.getCall( 0 ).firstArg ).to.equal( '❗ Found an error while verifying the provided global name:' );
		expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal( 'The global name can not start with a digit.' );

		expect( stubs.logger.info.calledTwice ).to.equal( true );
		expect( stubs.logger.info.getCall( 0 ).firstArg ).to.equal( 'The provided global name:    9Abc' );
		expect( stubs.logger.info.getCall( 1 ).firstArg ).to.equal( 'Allowed characters list:     0-9 A-Z a-z _ - / @' );
	} );

	it( 'logs info about incorrect global name format when it\'s starts with a `/` or ends with a `/``', () => {
		validateGlobalName( stubs.logger, '/9Abc/' );

		expect( stubs.logger.error.calledTwice ).to.equal( true );
		expect( stubs.logger.error.getCall( 0 ).firstArg ).to.equal( '❗ Found an error while verifying the provided global name:' );
		expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal(
			'The global name cannot start with "/" and end with "/" characters.'
		);

		expect( stubs.logger.info.calledTwice ).to.equal( true );
		expect( stubs.logger.info.getCall( 0 ).firstArg ).to.equal( 'The provided global name:    /9Abc/' );
		expect( stubs.logger.info.getCall( 1 ).firstArg ).to.equal( 'Allowed characters list:     0-9 A-Z a-z _ - / @' );
	} );

	it( 'accepts plugin names that only contain letters', () => {
		validateGlobalName( stubs.logger, 'FooBar' );

		expect( stubs.process.exit.called ).to.equal( false );
		expect( stubs.logger.error.called ).to.equal( false );
	} );

	it( 'accepts plugin names that fit the patter', () => {
		const result = validateGlobalName( stubs.logger, 'Foo9@_bar' );

		expect( result ).to.equal( true );
		expect( stubs.process.exit.called ).to.equal( false );
		expect( stubs.logger.error.called ).to.equal( false );
	} );
} );

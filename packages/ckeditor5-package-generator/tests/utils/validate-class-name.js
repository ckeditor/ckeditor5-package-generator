/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const mockery = require( 'mockery' );
const sinon = require( 'sinon' );
const { expect } = require( 'chai' );

describe( 'lib/utils/validate-class-name', () => {
	let stubs, validateClassName;

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

		validateClassName = require( '../../lib/utils/validate-class-name' );
	} );

	afterEach( () => {
		mockery.deregisterAll();
		sinon.restore();
	} );

	it( 'should be a function', () => {
		expect( validateClassName ).to.be.an( 'function' );
	} );

	it( 'does nothing if the class name is not provided', () => {
		validateClassName( stubs.logger, {} );

		expect( stubs.logger.process.called ).to.equal( false );
		expect( stubs.logger.error.called ).to.equal( false );
		expect( stubs.logger.info.called ).to.equal( false );
		expect( stubs.process.exit.called ).to.equal( false );
	} );

	it( 'logs the process if the class name is provided', () => {
		validateClassName( stubs.logger, { name: 'Foo' } );

		expect( stubs.logger.process.calledOnce ).to.equal( true );
		expect( stubs.logger.process.firstCall.firstArg ).to.equal( 'Verifying the specified class name.' );
	} );

	it( 'logs info about correct class name format in case of incorrect name', () => {
		validateClassName( stubs.logger, { name: '#abc' } );

		expect( stubs.logger.error.calledTwice ).to.equal( true );
		expect( stubs.logger.error.getCall( 0 ).firstArg ).to.equal( '❗ Found an error while verifying the provided class name:' );

		expect( stubs.logger.info.calledTwice ).to.equal( true );
		expect( stubs.logger.info.getCall( 0 ).firstArg ).to.equal( 'The provided class name:     #abc' );
		expect( stubs.logger.info.getCall( 1 ).firstArg ).to.equal( 'Allowed characters list:     0-9 A-Z a-z' );
	} );

	it( 'rejects class names containing non-allowed characters', () => {
		validateClassName( stubs.logger, { name: '#abc' } );

		expect( stubs.process.exit.called ).to.equal( true );
		expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal( 'The class name contains non-allowed characters.' );
	} );

	it( 'rejects class names that do not start with a letter', () => {
		validateClassName( stubs.logger, { name: '9Abc' } );

		expect( stubs.process.exit.called ).to.equal( true );
		expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal( 'The class name has to start with a letter.' );
	} );

	it( 'accepts class names that only contain letters', () => {
		validateClassName( stubs.logger, { name: 'FooBar' } );

		expect( stubs.process.exit.called ).to.equal( false );
		expect( stubs.logger.error.called ).to.equal( false );
	} );

	it( 'accepts class names that contain a number', () => {
		validateClassName( stubs.logger, { name: 'Foo9bar' } );

		expect( stubs.process.exit.called ).to.equal( false );
		expect( stubs.logger.error.called ).to.equal( false );
	} );
} );

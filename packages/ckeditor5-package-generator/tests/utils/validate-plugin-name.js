/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const mockery = require( 'mockery' );
const sinon = require( 'sinon' );
const { expect } = require( 'chai' );

describe( 'lib/utils/validate-plugin-name', () => {
	let stubs, validatePluginName;

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

		validatePluginName = require( '../../lib/utils/validate-plugin-name' );
	} );

	afterEach( () => {
		mockery.deregisterAll();
		sinon.restore();
	} );

	it( 'should be a function', () => {
		expect( validatePluginName ).to.be.an( 'function' );
	} );

	it( 'does nothing if the plugin name is not provided', () => {
		validatePluginName( stubs.logger );

		expect( stubs.logger.process.called ).to.equal( false );
		expect( stubs.logger.error.called ).to.equal( false );
		expect( stubs.logger.info.called ).to.equal( false );
		expect( stubs.process.exit.called ).to.equal( false );
	} );

	it( 'logs the process if the plugin name is provided', () => {
		validatePluginName( stubs.logger, 'Foo' );

		expect( stubs.logger.process.calledOnce ).to.equal( true );
		expect( stubs.logger.process.firstCall.firstArg ).to.equal( 'Verifying the specified plugin name.' );
	} );

	it( 'logs info about correct plugin name format in case of incorrect name', () => {
		validatePluginName( stubs.logger, '#abc' );

		expect( stubs.logger.error.calledTwice ).to.equal( true );
		expect( stubs.logger.error.getCall( 0 ).firstArg ).to.equal( '❗ Found an error while verifying the provided plugin name:' );

		expect( stubs.logger.info.calledTwice ).to.equal( true );
		expect( stubs.logger.info.getCall( 0 ).firstArg ).to.equal( 'The provided plugin name:    #abc' );
		expect( stubs.logger.info.getCall( 1 ).firstArg ).to.equal( 'Allowed characters list:     0-9 A-Z a-z' );
	} );

	it( 'rejects plugin names containing non-allowed characters', () => {
		validatePluginName( stubs.logger, '#abc' );

		expect( stubs.process.exit.called ).to.equal( true );
		expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal( 'The plugin name contains non-allowed characters.' );
	} );

	it( 'rejects plugin names that do not start with a letter', () => {
		validatePluginName( stubs.logger, '9Abc' );

		expect( stubs.process.exit.called ).to.equal( true );
		expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal( 'The plugin name can not start with a digit.' );
	} );

	it( 'accepts plugin names that only contain letters', () => {
		validatePluginName( stubs.logger, 'FooBar' );

		expect( stubs.process.exit.called ).to.equal( false );
		expect( stubs.logger.error.called ).to.equal( false );
	} );

	it( 'accepts plugin names that contain a number', () => {
		validatePluginName( stubs.logger, 'Foo9bar' );

		expect( stubs.process.exit.called ).to.equal( false );
		expect( stubs.logger.error.called ).to.equal( false );
	} );
} );

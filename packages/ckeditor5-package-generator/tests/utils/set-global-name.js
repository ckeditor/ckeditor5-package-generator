/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

const mockery = require( 'mockery' );
const sinon = require( 'sinon' );
const { expect, config } = require( 'chai' );

config.truncateThreshold = 0;

describe( 'lib/utils/set-global-name', () => {
	let stubs, setGlobalName;

	beforeEach( () => {
		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

		stubs = {
			inquirer: {
				prompt: sinon.stub()
			},
			logger: {
				info: sinon.stub(),
				error: sinon.stub()
			},
			validateGlobalName: sinon.stub()
		};

		stubs.inquirer.prompt.resolves( 'GLOBAL' );

		mockery.registerMock( 'inquirer', stubs.inquirer );

		setGlobalName = require( '../../lib/utils/set-global-name' );
	} );

	afterEach( () => {
		mockery.disable();
	} );

	it( 'should be a function', () => {
		expect( setGlobalName ).to.be.a( 'function' );
	} );

	it( 'calls prompt() with correct arguments', async () => {
		await setGlobalName( stubs.logger );

		expect( stubs.inquirer.prompt.callCount ).to.equal( 1 );
		expect( stubs.inquirer.prompt.firstCall.firstArg.required ).to.equal( true );
		expect( stubs.inquirer.prompt.firstCall.firstArg.message ).to.equal( 'Enter the global name for plugin for UMD build' );
		expect( stubs.inquirer.prompt.firstCall.firstArg.type ).to.equal( 'input' );
		expect( stubs.inquirer.prompt.firstCall.firstArg.name ).to.equal( 'globalName' );
		expect( stubs.inquirer.prompt.firstCall.firstArg.validate ).to.be.a( 'function' );
	} );

	it( 'returns correct value when user input "GLOBAL"', async () => {
		const result = await setGlobalName( stubs.logger, 'GLOBAL' );

		expect( result ).to.equal( 'GLOBAL' );
	} );

	it( 'falls back to user input when global name has invalid value', async () => {
		const result = await setGlobalName( stubs.logger, '1234foobar' );

		expect( result ).to.equal( undefined );

		expect( stubs.inquirer.prompt.callCount ).to.equal( 1 );
	} );
} );

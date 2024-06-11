/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

const mockery = require( 'mockery' );
const sinon = require( 'sinon' );
const { expect } = require( 'chai' );

describe( 'lib/utils/choose-installation-methods', () => {
	let stubs, chooseInstallationMethods;

	const INSTALLATION_METHODS = [
		{
			value: 'current',
			displayName: 'Current (v42.0.0+) [recommended]'
		},
		{
			value: 'current-and-legacy',
			displayName: 'Current and legacy methods with DLLs (pre-42.0.0). [⚠️ Requires additional work with imports. See: <link>]'
		}
	];

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
				error: sinon.stub()
			}
		};

		stubs.inquirer.prompt.resolves( { installationMethod: INSTALLATION_METHODS[ 0 ].displayName } );

		mockery.registerMock( 'inquirer', stubs.inquirer );

		chooseInstallationMethods = require( '../../lib/utils/choose-installation-methods' );
	} );

	afterEach( () => {
		mockery.disable();
	} );

	it( 'should be a function', () => {
		expect( chooseInstallationMethods ).to.be.a( 'function' );
	} );

	it( 'calls prompt() with correct arguments', async () => {
		await chooseInstallationMethods( stubs.logger );

		expect( stubs.inquirer.prompt.callCount ).to.equal( 1 );
		expect( stubs.inquirer.prompt.firstCall.firstArg ).to.deep.equal( [ {
			prefix: '📍',
			name: 'installationMethod',
			message: 'Which installation methods of CKEditor 5 do you want to support?',
			type: 'list',
			choices: INSTALLATION_METHODS.map( ( { displayName } ) => displayName )
		} ] );
	} );

	it( 'returns correct value when user picks "Current"', async () => {
		const result = await chooseInstallationMethods( stubs.logger );

		expect( result ).to.equal( 'current' );
	} );

	it( 'returns correct value when user picks "Current and legacy methods with DLLs"', async () => {
		stubs.inquirer.prompt.resolves( { installationMethod: INSTALLATION_METHODS[ 1 ].displayName } );

		const result = await chooseInstallationMethods( stubs.logger );

		expect( result ).to.equal( 'current-and-legacy' );
	} );

	it( 'returns installation method option if it defines a supported value', async () => {
		const result = await chooseInstallationMethods( stubs.logger, 'current' );

		expect( result ).to.equal( 'current' );

		expect( stubs.inquirer.prompt.callCount ).to.equal( 0 );
	} );

	it( 'falls back to user input when installation method option has invalid value', async () => {
		stubs.inquirer.prompt.resolves( { installationMethod: INSTALLATION_METHODS[ 1 ].displayName } );

		const result = await chooseInstallationMethods( stubs.logger, 'foobar' );

		expect( result ).to.equal( 'current-and-legacy' );

		expect( stubs.inquirer.prompt.callCount ).to.equal( 1 );
	} );
} );

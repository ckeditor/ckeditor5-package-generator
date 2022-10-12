/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

const mockery = require( 'mockery' );
const sinon = require( 'sinon' );
const { expect } = require( 'chai' );

describe( 'lib/utils/choose-programming-language', () => {
	let stubs, chooseProgrammingLanguage;

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

		stubs.inquirer.prompt.resolves( { programmingLanguage: 'JavaScript' } );

		mockery.registerMock( 'inquirer', stubs.inquirer );

		chooseProgrammingLanguage = require( '../../lib/utils/choose-programming-language' );
	} );

	afterEach( () => {
		mockery.disable();
	} );

	it( 'should be a function', () => {
		expect( chooseProgrammingLanguage ).to.be.a( 'function' );
	} );

	it( 'calls prompt() with correct arguments', async () => {
		await chooseProgrammingLanguage( stubs.logger, {} );

		expect( stubs.inquirer.prompt.callCount ).to.equal( 1 );
		expect( stubs.inquirer.prompt.firstCall.firstArg ).to.deep.equal( [ {
			prefix: '📍',
			name: 'programmingLanguage',
			message: 'Choose your programming language:',
			type: 'list',
			choices: [ 'JavaScript', 'TypeScript (experimental)' ]
		} ] );
	} );

	it( 'returns correct value when user picks JavaScript', async () => {
		const result = await chooseProgrammingLanguage( stubs.logger, {} );

		expect( result ).to.equal( 'js' );
	} );

	it( 'returns correct value when user picks TypeScript', async () => {
		stubs.inquirer.prompt.resolves( { programmingLanguage: 'TypeScript (experimental)' } );

		const result = await chooseProgrammingLanguage( stubs.logger, {} );

		expect( result ).to.equal( 'ts' );
	} );

	it( 'returns lang option if it has valid value', async () => {
		const result = await chooseProgrammingLanguage( stubs.logger, { lang: 'ts' } );

		expect( result ).to.equal( 'ts' );

		expect( stubs.inquirer.prompt.callCount ).to.equal( 0 );
	} );

	it( 'falls back to user input when lang option has invalid value', async () => {
		stubs.inquirer.prompt.resolves( { programmingLanguage: 'TypeScript (experimental)' } );

		const result = await chooseProgrammingLanguage( stubs.logger, { lang: 'python' } );

		expect( result ).to.equal( 'ts' );

		expect( stubs.inquirer.prompt.callCount ).to.equal( 1 );
	} );
} );

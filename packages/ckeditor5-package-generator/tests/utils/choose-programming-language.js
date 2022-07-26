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
		await chooseProgrammingLanguage();

		expect( stubs.inquirer.prompt.calledOnce ).to.equal( true );
		expect( stubs.inquirer.prompt.firstCall.firstArg ).to.deep.equal( [ {
			prefix: '📍',
			name: 'programmingLanguage',
			message: 'Choose your programming language:',
			type: 'list',
			choices: [ 'JavaScript', 'TypeScript' ]
		} ] );
	} );

	it( 'returns correct value when user picks JavaScript', async () => {
		const result = await chooseProgrammingLanguage();

		expect( result ).to.equal( 'js' );
	} );

	it( 'returns correct value when user picks TypeScript', async () => {
		stubs.inquirer.prompt.resolves( { programmingLanguage: 'TypeScript' } );

		const result = await chooseProgrammingLanguage();

		expect( result ).to.equal( 'ts' );
	} );
} );

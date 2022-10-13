/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

const { expect } = require( 'chai' );
const mockery = require( 'mockery' );
const sinon = require( 'sinon' );

describe( 'lib/utils/choose-package-manager', () => {
	let stubs, choosePackageManager;

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
			isYarnInstalled: sinon.stub()
		};

		mockery.registerMock( './is-yarn-installed', stubs.isYarnInstalled );
		mockery.registerMock( 'inquirer', stubs.inquirer );

		choosePackageManager = require( '../../lib/utils/choose-package-manager' );
	} );

	afterEach( () => {
		mockery.deregisterAll();
		mockery.disable();
		sinon.restore();
	} );

	it( 'should return npm when npm argument is true ', async () => {
		const result = await choosePackageManager( { useNpm: true } );

		expect( result ).to.equal( 'npm' );
	} );

	it( 'should return npm when npm and yarn arguments are true ', async () => {
		const result = await choosePackageManager( { useNpm: true, useYarn: true } );

		expect( result ).to.equal( 'npm' );
	} );

	it( 'should return yarn when yarn argument is true ', async () => {
		const result = await choosePackageManager( { useYarn: true } );

		expect( result ).to.equal( 'yarn' );
	} );

	it( 'should return yarn when isYarnInstalled returns true and arguments are false', async () => {
		stubs.isYarnInstalled.returns( true );

		const result = await choosePackageManager();

		expect( result ).to.equal( 'yarn' );
	} );

	it( 'should return yarn when prompt returns yarn and isYarnInstalled and arguments are false', async () => {
		stubs.inquirer.prompt.resolves( { packageManager: 'yarn' } );
		stubs.isYarnInstalled.returns( false );

		const result = await choosePackageManager();

		expect( result ).to.equal( 'yarn' );
	} );

	it( 'should return npm when prompt returns npm and isYarnInstalled and arguments are false', async () => {
		stubs.inquirer.prompt.resolves( { packageManager: 'npm' } );
		stubs.isYarnInstalled.returns( false );

		const result = await choosePackageManager();

		expect( result ).to.equal( 'npm' );
	} );
} );

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

		stubs.inquirer.prompt.resolves( { packageManager: 'yarn' } );

		mockery.registerMock( './is-yarn-installed', stubs.isYarnInstalled );
		mockery.registerMock( 'inquirer', stubs.inquirer );

		choosePackageManager = require( '../../lib/utils/choose-package-manager' );
	} );

	afterEach( () => {
		mockery.deregisterAll();
		mockery.disable();
		sinon.restore();
	} );

	it( 'should return npm when npm argument is true and yarn is installed', async () => {
		stubs.isYarnInstalled.returns( true );

		const result = await choosePackageManager( { isNpmFlagUsed: true, isYarnFlagUsed: false } );

		expect( result ).to.equal( 'npm' );
	} );

	it( 'should call prompt when arguments are true and yarn is installed', async () => {
		stubs.isYarnInstalled.returns( true );

		await choosePackageManager( { isNpmFlagUsed: true, isYarnFlagUsed: true } );

		expect( stubs.inquirer.prompt.called ).to.equal( true );
	} );

	it( 'should throw error when yarn argument is true and yarn is not installed', async () => {
		stubs.isYarnInstalled.returns( false );

		try {
			await choosePackageManager( { isNpmFlagUsed: false, isYarnFlagUsed: true } );
		} catch ( e ) {
			expect( e ).to.exist;
		}
	} );

	it( 'should return yarn when yarn argument is true and yarn is installed', async () => {
		stubs.isYarnInstalled.returns( true );

		const result = await choosePackageManager( { isNpmFlagUsed: false, isYarnFlagUsed: true } );

		expect( result ).to.equal( 'yarn' );
	} );

	it( 'should return npm when yarn is not installed and arguments false', async () => {
		stubs.isYarnInstalled.returns( false );

		const result = await choosePackageManager( { isNpmFlagUsed: false, isYarnFlagUsed: false } );

		expect( result ).to.equal( 'npm' );
	} );

	it( 'should return yarn when prompt returns yarn, yarn is installed and arguments are false', async () => {
		stubs.inquirer.prompt.resolves( { packageManager: 'yarn' } );
		stubs.isYarnInstalled.returns( true );

		const result = await choosePackageManager( { isNpmFlagUsed: false, isYarnFlagUsed: false } );

		expect( result ).to.equal( 'yarn' );
	} );

	it( 'should return npm when prompt returns npm, yarn is installed and arguments are false', async () => {
		stubs.inquirer.prompt.resolves( { packageManager: 'npm' } );
		stubs.isYarnInstalled.returns( true );

		const result = await choosePackageManager( { isYarnFlagUsed: false, isNpmFlagUsed: false } );

		expect( result ).to.equal( 'npm' );
	} );

	it( 'should not call prompt when yarn is not installed', async () => {
		stubs.isYarnInstalled.returns( false );

		await choosePackageManager( { isYarnFlagUsed: false, isNpmFlagUsed: false } );

		expect( stubs.inquirer.prompt.called ).to.equal( false );
	} );

	it( 'should not call prompt when yarn is installed and npm flag used', async () => {
		stubs.isYarnInstalled.returns( true );

		await choosePackageManager( { isYarnFlagUsed: false, isNpmFlagUsed: true } );

		expect( stubs.inquirer.prompt.called ).to.equal( false );
	} );

	it( 'should not call prompt when yarn is installed and yarn flag used', async () => {
		stubs.isYarnInstalled.returns( true );

		await choosePackageManager( { isYarnFlagUsed: true, isNpmFlagUsed: false } );

		expect( stubs.inquirer.prompt.called ).to.equal( false );
	} );
} );
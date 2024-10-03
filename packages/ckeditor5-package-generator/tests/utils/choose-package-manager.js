/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import inquirer from 'inquirer';
import isYarnInstalled from '../../lib/utils/is-yarn-installed.js';
import choosePackageManager from '../../lib/utils/choose-package-manager.js';

vi.mock( 'inquirer' );
vi.mock( '../../lib/utils/is-yarn-installed.js' );

describe( 'lib/utils/choose-package-manager', () => {
	beforeEach( () => {
		vi.mocked( inquirer.prompt ).mockResolvedValue( { packageManager: 'yarn' } );
		vi.mocked( isYarnInstalled ).mockReturnValue( true );
	} );

	it( 'should be a function', () => {
		expect( choosePackageManager ).toBeTypeOf( 'function' );
	} );

	it( 'should return npm when npm argument is true and yarn is installed', async () => {
		const result = await choosePackageManager( true, false );

		expect( result ).toEqual( 'npm' );
	} );

	it( 'should call prompt when arguments are true and yarn is installed', async () => {
		await choosePackageManager( true, true );

		expect( inquirer.prompt ).toHaveBeenCalled();
	} );

	it( 'should throw error when yarn argument is true and yarn is not installed', () => {
		vi.mocked( isYarnInstalled ).mockReturnValue( false );

		return choosePackageManager( false, true )
			.then( () => {
				throw new Error( 'Expected to throw.' );
			} )
			.catch( err => {
				expect( err.message ).toEqual( 'Detected --use-yarn option but yarn is not installed.' );
			} );
	} );

	it( 'should return yarn when yarn argument is true and yarn is installed', async () => {
		const result = await choosePackageManager( false, true );

		expect( result ).toEqual( 'yarn' );
	} );

	it( 'should return npm when yarn is not installed and arguments false', async () => {
		vi.mocked( isYarnInstalled ).mockReturnValue( false );

		const result = await choosePackageManager( false, false );

		expect( result ).toEqual( 'npm' );
	} );

	it( 'should return yarn when prompt returns yarn, yarn is installed and arguments are false', async () => {
		const result = await choosePackageManager( false, false );

		expect( result ).toEqual( 'yarn' );
	} );

	it( 'should return npm when prompt returns npm, yarn is installed and arguments are false', async () => {
		vi.mocked( inquirer.prompt ).mockResolvedValue( { packageManager: 'npm' } );

		const result = await choosePackageManager( { useYarn: false, useNpm: false } );

		expect( result ).toEqual( 'npm' );
	} );

	it( 'should not call prompt when yarn is not installed', async () => {
		vi.mocked( isYarnInstalled ).mockReturnValue( false );

		await choosePackageManager( { useYarn: false, useNpm: false } );

		expect( inquirer.prompt ).not.toHaveBeenCalled();
	} );

	it( 'should not call prompt when yarn is installed and npm flag used', async () => {
		await choosePackageManager( { useYarn: false, useNpm: true } );

		expect( inquirer.prompt ).not.toHaveBeenCalled();
	} );

	it( 'should not call prompt when yarn is installed and yarn flag used', async () => {
		await choosePackageManager( { useYarn: true, useNpm: false } );

		expect( inquirer.prompt ).not.toHaveBeenCalled();
	} );
} );

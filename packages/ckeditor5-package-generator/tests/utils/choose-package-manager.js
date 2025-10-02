/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import inquirer from 'inquirer';
import isYarnInstalled from '../../lib/utils/is-yarn-installed.js';
import isPnpmInstalled from '../../lib/utils/is-pnpm-installed.js';
import choosePackageManager from '../../lib/utils/choose-package-manager.js';

vi.mock( 'inquirer' );
vi.mock( '../../lib/utils/is-yarn-installed.js' );
vi.mock( '../../lib/utils/is-pnpm-installed.js' );
vi.mock( 'chalk', () => ( {
	default: {
		yellow: vi.fn( str => str )
	}
} ) );

describe( 'lib/utils/choose-package-manager', () => {
	const logger = { info: vi.fn() };

	beforeEach( () => {
		vi.mocked( inquirer.prompt ).mockResolvedValue( { packageManager: 'yarn' } );
		vi.mocked( isYarnInstalled ).mockReturnValue( true );
		vi.mocked( isPnpmInstalled ).mockReturnValue( true );
	} );

	it( 'should be a function', () => {
		expect( choosePackageManager ).toBeTypeOf( 'function' );
	} );

	it( 'should return npm when npm argument is true', async () => {
		const result = await choosePackageManager( logger, true, false, false );

		expect( result ).toEqual( 'npm' );
	} );

	it( 'should return yarn when yarn argument is true and yarn is installed', async () => {
		vi.mocked( isYarnInstalled ).mockReturnValue( true );

		const result = await choosePackageManager( logger, false, true, false );

		expect( result ).toEqual( 'yarn' );
	} );

	it( 'should return pnpm when pnpm argument is true and pnpm is installed', async () => {
		vi.mocked( isPnpmInstalled ).mockReturnValue( true );

		const result = await choosePackageManager( logger, false, false, true );

		expect( result ).toEqual( 'pnpm' );
	} );

	it( 'should call prompt when arguments are false', async () => {
		await choosePackageManager( logger, false, false, false );

		expect( inquirer.prompt ).toHaveBeenCalled();
	} );

	it( 'should throw error when yarn argument is true and yarn is not installed', () => {
		vi.mocked( isYarnInstalled ).mockReturnValue( false );

		return choosePackageManager( logger, false, true, false )
			.then( () => {
				throw new Error( 'Expected to throw.' );
			} )
			.catch( err => {
				expect( err.message ).toEqual( 'Detected --use-yarn option but yarn is not installed.' );
			} );
	} );

	it( 'should throw error when pnpm argument is true and pnpm is not installed', () => {
		vi.mocked( isPnpmInstalled ).mockReturnValue( false );

		return choosePackageManager( logger, false, false, true )
			.then( () => {
				throw new Error( 'Expected to throw.' );
			} )
			.catch( err => {
				expect( err.message ).toEqual( 'Detected --use-pnpm option but pnpm is not installed.' );
			} );
	} );

	it( 'should return npm and log info when yarn and pnpm are not installed', async () => {
		vi.mocked( isPnpmInstalled ).mockReturnValue( false );
		vi.mocked( isYarnInstalled ).mockReturnValue( false );

		const result = await choosePackageManager( logger, false, false, false );

		expect( result ).toEqual( 'npm' );
		expect( inquirer.prompt ).not.toHaveBeenCalled();
		expect( logger.info ).toHaveBeenCalledWith( 'Using npm as no other supported package manager is installed.' );
	} );

	it( 'should call prompt with correct arguments when yarn installed and pnpm not installed', async () => {
		vi.mocked( isYarnInstalled ).mockReturnValue( true );
		vi.mocked( isPnpmInstalled ).mockReturnValue( false );

		await choosePackageManager( logger, false, false, false );

		expect( inquirer.prompt ).toHaveBeenCalledWith( [ expect.objectContaining( { choices: [ 'npm', 'yarn' ] } ) ] );
	} );

	it( 'should call prompt with correct arguments when yarn not installed and pnpm installed', async () => {
		vi.mocked( isYarnInstalled ).mockReturnValue( false );
		vi.mocked( isPnpmInstalled ).mockReturnValue( true );

		await choosePackageManager( logger, false, false, false );

		expect( inquirer.prompt ).toHaveBeenCalledWith( [ expect.objectContaining( { choices: [ 'npm', 'pnpm' ] } ) ] );
	} );

	it( 'should call prompt with correct arguments when yarn and pnpm are installed', async () => {
		vi.mocked( isYarnInstalled ).mockReturnValue( true );
		vi.mocked( isPnpmInstalled ).mockReturnValue( true );

		await choosePackageManager( logger, false, false, false );

		expect( inquirer.prompt ).toHaveBeenCalledWith( [ expect.objectContaining( { choices: [ 'npm', 'yarn', 'pnpm' ] } ) ] );
	} );

	it( 'should return yarn when prompt returns yarn, yarn is installed and arguments are false', async () => {
		vi.mocked( inquirer.prompt ).mockResolvedValue( { packageManager: 'yarn' } );

		const result = await choosePackageManager( logger, false, false, false );

		expect( result ).toEqual( 'yarn' );
	} );

	it( 'should return npm when prompt returns npm, yarn is installed and arguments are false', async () => {
		vi.mocked( inquirer.prompt ).mockResolvedValue( { packageManager: 'npm' } );

		const result = await choosePackageManager( logger, false, false, false );

		expect( result ).toEqual( 'npm' );
	} );

	it( 'should return pnpm when prompt returns pnpm, pnpm is installed and arguments are false', async () => {
		vi.mocked( inquirer.prompt ).mockResolvedValue( { packageManager: 'pnpm' } );

		const result = await choosePackageManager( logger, false, false, false );

		expect( result ).toEqual( 'pnpm' );
	} );

	it( 'should not call prompt when yarn is installed and npm flag used', async () => {
		await choosePackageManager( logger, true, false, false );

		expect( inquirer.prompt ).not.toHaveBeenCalled();
	} );

	it( 'should not call prompt when yarn is installed and yarn flag used', async () => {
		await choosePackageManager( logger, false, true, false );

		expect( inquirer.prompt ).not.toHaveBeenCalled();
	} );

	it( 'should call prompt when pnpm is not installed and arguments are false', async () => {
		vi.mocked( isPnpmInstalled ).mockReturnValue( false );

		await choosePackageManager( logger, false, false, false );

		expect( inquirer.prompt ).toHaveBeenCalled();
	} );

	it( 'should not call prompt when pnpm is installed and pnpm flag used', async () => {
		await choosePackageManager( logger, false, false, true );

		expect( inquirer.prompt ).not.toHaveBeenCalled();
	} );

	it( 'should call prompt when multiple package managers are specified (npm & yarn)', async () => {
		await choosePackageManager( logger, true, true, false );

		expect( inquirer.prompt ).toHaveBeenCalled();
	} );

	it( 'should call prompt when multiple package managers are specified (npm & pnpm)', async () => {
		await choosePackageManager( logger, true, false, true );

		expect( inquirer.prompt ).toHaveBeenCalled();
	} );

	it( 'should call prompt when multiple package managers are specified (yarn & pnpm)', async () => {
		await choosePackageManager( logger, false, true, true );

		expect( inquirer.prompt ).toHaveBeenCalled();
	} );

	it( 'should call prompt when all package managers are specified (npm & yarn & pnpm)', async () => {
		await choosePackageManager( logger, true, true, true );

		expect( inquirer.prompt ).toHaveBeenCalled();
	} );
} );

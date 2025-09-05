/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import inquirer from 'inquirer';
import choosePackageManager from '../../lib/utils/choose-package-manager.js';

vi.mock( 'inquirer' );

describe( 'lib/utils/choose-package-manager', () => {
	beforeEach( () => {
		vi.mocked( inquirer.prompt ).mockResolvedValue( { packageManager: 'yarn' } );
	} );

	it( 'should be a function', () => {
		expect( choosePackageManager ).toBeTypeOf( 'function' );
	} );

	it( 'should return npm when npm argument is true', async () => {
		const result = await choosePackageManager( true, false, false );

		expect( result ).toEqual( 'npm' );
	} );

	it( 'should return yarn when yarn argument is true', async () => {
		const result = await choosePackageManager( false, true, false );

		expect( result ).toEqual( 'yarn' );
	} );

	it( 'should return pnpm when pnpm argument is true', async () => {
		const result = await choosePackageManager( false, false, true );

		expect( result ).toEqual( 'pnpm' );
	} );

	it( 'should return npm when prompt returns npm and arguments are false', async () => {
		vi.mocked( inquirer.prompt ).mockResolvedValue( { packageManager: 'npm' } );

		const result = await choosePackageManager( false, false, false );

		expect( result ).toEqual( 'npm' );
	} );

	it( 'should return yarn when prompt returns yarn and arguments are false', async () => {
		vi.mocked( inquirer.prompt ).mockResolvedValue( { packageManager: 'yarn' } );

		const result = await choosePackageManager( false, false, false );

		expect( result ).toEqual( 'yarn' );
	} );

	it( 'should return pnpm when prompt returns pnpm and arguments are false', async () => {
		vi.mocked( inquirer.prompt ).mockResolvedValue( { packageManager: 'pnpm' } );

		const result = await choosePackageManager( false, false, false );

		expect( result ).toEqual( 'pnpm' );
	} );

	it( 'should not call prompt when npm flag used', async () => {
		await choosePackageManager( true, false, false );

		expect( inquirer.prompt ).not.toHaveBeenCalled();
	} );

	it( 'should not call prompt when yarn flag used', async () => {
		await choosePackageManager( false, true, false );

		expect( inquirer.prompt ).not.toHaveBeenCalled();
	} );

	it( 'should not call prompt when pnpm flag used', async () => {
		await choosePackageManager( false, false, true );

		expect( inquirer.prompt ).not.toHaveBeenCalled();
	} );

	it( 'should call prompt when multiple package managers are specified (npm & yarn)', async () => {
		await choosePackageManager( true, true, false );

		expect( inquirer.prompt ).toHaveBeenCalled();
	} );

	it( 'should call prompt when multiple package managers are specified (npm & pnpm)', async () => {
		await choosePackageManager( true, false, true );

		expect( inquirer.prompt ).toHaveBeenCalled();
	} );

	it( 'should call prompt when multiple package managers are specified (yarn & pnpm)', async () => {
		await choosePackageManager( false, true, true );

		expect( inquirer.prompt ).toHaveBeenCalled();
	} );

	it( 'should call prompt when all package managers are specified (npm & yarn & pnpm)', async () => {
		await choosePackageManager( true, true, true );

		expect( inquirer.prompt ).toHaveBeenCalled();
	} );
} );

/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { promptSelect } from '../../lib/utils/prompt.js';
import isYarnInstalled from '../../lib/utils/is-yarn-installed.js';
import isPnpmInstalled from '../../lib/utils/is-pnpm-installed.js';
import choosePackageManager from '../../lib/utils/choose-package-manager.js';

vi.mock( '../../lib/utils/prompt.js' );
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
		vi.mocked( promptSelect ).mockResolvedValue( 'yarn' );
		vi.mocked( isYarnInstalled ).mockReturnValue( true );
		vi.mocked( isPnpmInstalled ).mockReturnValue( true );
	} );

	it( 'should be a function', () => {
		expect( choosePackageManager ).toBeTypeOf( 'function' );
	} );

	it( 'returns npm when npm argument is true', async () => {
		const result = await choosePackageManager( logger, { useNpm: true, useYarn: false, usePnpm: false } );

		expect( result ).toEqual( 'npm' );
		expect( promptSelect ).not.toHaveBeenCalled();
	} );

	it( 'returns yarn when yarn argument is true and yarn is installed', async () => {
		const result = await choosePackageManager( logger, { useNpm: false, useYarn: true, usePnpm: false } );

		expect( result ).toEqual( 'yarn' );
		expect( promptSelect ).not.toHaveBeenCalled();
	} );

	it( 'returns pnpm when pnpm argument is true and pnpm is installed', async () => {
		const result = await choosePackageManager( logger, { useNpm: false, useYarn: false, usePnpm: true } );

		expect( result ).toEqual( 'pnpm' );
		expect( promptSelect ).not.toHaveBeenCalled();
	} );

	it( 'prompts when arguments are false', async () => {
		await choosePackageManager( logger, { useNpm: false, useYarn: false, usePnpm: false } );

		expect( promptSelect ).toHaveBeenCalledWith( {
			message: 'Package manager',
			initialValue: 'npm',
			options: [
				{ value: 'npm', label: 'npm' },
				{ value: 'yarn', label: 'yarn' },
				{ value: 'pnpm', label: 'pnpm' }
			]
		} );
	} );

	it( 'returns npm and logs info when yarn and pnpm are not installed', async () => {
		vi.mocked( isYarnInstalled ).mockReturnValue( false );
		vi.mocked( isPnpmInstalled ).mockReturnValue( false );

		const result = await choosePackageManager( logger, { useNpm: false, useYarn: false, usePnpm: false } );

		expect( result ).toEqual( 'npm' );
		expect( promptSelect ).not.toHaveBeenCalled();
		expect( logger.info ).toHaveBeenCalledWith( 'Using npm as no other supported package manager is installed.' );
	} );

	it( 'prompts with only installed package managers', async () => {
		vi.mocked( isPnpmInstalled ).mockReturnValue( false );

		await choosePackageManager( logger, { useNpm: false, useYarn: false, usePnpm: false } );

		expect( promptSelect ).toHaveBeenCalledWith( {
			message: 'Package manager',
			initialValue: 'npm',
			options: [
				{ value: 'npm', label: 'npm' },
				{ value: 'yarn', label: 'yarn' }
			]
		} );
	} );

	it( 'falls back to the prompt when the requested manager is unavailable', async () => {
		vi.mocked( isYarnInstalled ).mockReturnValue( false );
		vi.mocked( promptSelect ).mockResolvedValue( 'pnpm' );

		const result = await choosePackageManager( logger, { useNpm: false, useYarn: true, usePnpm: false } );

		expect( result ).toEqual( 'pnpm' );
		expect( logger.info ).toHaveBeenCalledWith( 'Ignoring unavailable package manager choices: yarn.' );
		expect( promptSelect ).toHaveBeenCalledWith( {
			message: 'Package manager',
			initialValue: 'npm',
			options: [
				{ value: 'npm', label: 'npm' },
				{ value: 'pnpm', label: 'pnpm' }
			]
		} );
	} );

	it( 'prompts when multiple package managers are specified', async () => {
		await choosePackageManager( logger, { useNpm: true, useYarn: true, usePnpm: false } );

		expect( logger.info ).toHaveBeenCalledWith( 'Multiple package managers were requested. Choose one to continue.' );
		expect( promptSelect ).toHaveBeenCalledTimes( 1 );
		expect( promptSelect ).toHaveBeenCalledWith( expect.objectContaining( {
			initialValue: 'npm'
		} ) );
	} );

	it( 'returns the only available requested package manager', async () => {
		vi.mocked( isYarnInstalled ).mockReturnValue( false );

		const result = await choosePackageManager( logger, { useNpm: false, useYarn: true, usePnpm: true } );

		expect( result ).toEqual( 'pnpm' );
		expect( logger.info ).toHaveBeenCalledWith( 'Ignoring unavailable package manager choices: yarn.' );
		expect( logger.info ).not.toHaveBeenCalledWith( 'Multiple package managers were requested. Choose one to continue.' );
		expect( promptSelect ).not.toHaveBeenCalled();
	} );
} );

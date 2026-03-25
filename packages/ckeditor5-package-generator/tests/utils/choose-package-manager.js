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
vi.mock( 'node:util', async importOriginal => ( {
	...( await importOriginal() ),
	styleText: vi.fn( ( _style, str ) => str )
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

	it( 'returns npm when npm is requested', async () => {
		const result = await choosePackageManager( logger, 'npm' );

		expect( result ).toEqual( 'npm' );
		expect( promptSelect ).not.toHaveBeenCalled();
	} );

	it( 'returns yarn when yarn is requested and installed', async () => {
		const result = await choosePackageManager( logger, 'yarn' );

		expect( result ).toEqual( 'yarn' );
		expect( promptSelect ).not.toHaveBeenCalled();
	} );

	it( 'returns pnpm when pnpm is requested and installed', async () => {
		const result = await choosePackageManager( logger, 'pnpm' );

		expect( result ).toEqual( 'pnpm' );
		expect( promptSelect ).not.toHaveBeenCalled();
	} );

	it( 'prompts when no package manager is requested', async () => {
		await choosePackageManager( logger );

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

		const result = await choosePackageManager( logger );

		expect( result ).toEqual( 'npm' );
		expect( promptSelect ).not.toHaveBeenCalled();
		expect( logger.info ).toHaveBeenCalledWith( 'Using npm as no other supported package manager is installed.' );
	} );

	it( 'ignores unavailable request when only npm is available', async () => {
		vi.mocked( isYarnInstalled ).mockReturnValue( false );
		vi.mocked( isPnpmInstalled ).mockReturnValue( false );

		const result = await choosePackageManager( logger, 'yarn' );

		expect( result ).toEqual( 'npm' );
		expect( logger.info ).toHaveBeenCalledWith( 'Ignoring unavailable package manager choice: yarn.' );
		expect( logger.info ).toHaveBeenCalledWith( 'Using npm as no other supported package manager is installed.' );
		expect( promptSelect ).not.toHaveBeenCalled();
	} );

	it( 'prompts with only installed package managers', async () => {
		vi.mocked( isPnpmInstalled ).mockReturnValue( false );

		await choosePackageManager( logger );

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

		const result = await choosePackageManager( logger, 'yarn' );

		expect( result ).toEqual( 'pnpm' );
		expect( logger.info ).toHaveBeenCalledWith( 'Ignoring unavailable package manager choice: yarn.' );
		expect( promptSelect ).toHaveBeenCalledWith( {
			message: 'Package manager',
			initialValue: 'npm',
			options: [
				{ value: 'npm', label: 'npm' },
				{ value: 'pnpm', label: 'pnpm' }
			]
		} );
	} );

	it( 'falls back to the prompt when the requested manager is not supported', async () => {
		const result = await choosePackageManager( logger, 'bun' );

		expect( result ).toEqual( 'yarn' );
		expect( logger.info ).toHaveBeenCalledWith(
			'The provided package manager "bun" is not supported. Choose one of: npm, yarn, pnpm.'
		);
		expect( promptSelect ).toHaveBeenCalledTimes( 1 );
		expect( promptSelect ).toHaveBeenCalledWith( expect.objectContaining( {
			initialValue: 'npm'
		} ) );
	} );
} );

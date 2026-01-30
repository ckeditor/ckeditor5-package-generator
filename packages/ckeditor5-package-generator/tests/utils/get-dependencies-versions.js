/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import getPackageVersion from '../../lib/utils/get-package-version.js';
import getDependenciesVersions from '../../lib/utils/get-dependencies-versions.js';

vi.mock( '../../lib/utils/get-package-version.js' );

describe( 'lib/utils/get-dependencies-versions', () => {
	let stubs;

	beforeEach( () => {
		vi.mocked( getPackageVersion ).mockImplementation( packageName => {
			if ( packageName === 'ckeditor5' ) {
				return Promise.resolve( '30.0.0' );
			}

			if ( packageName === '@ckeditor/ckeditor5-dev-build-tools' ) {
				return Promise.resolve( '7.0.0' );
			}

			if ( packageName === '@ckeditor/ckeditor5-inspector' ) {
				return Promise.resolve( '4.0.0' );
			}

			if ( packageName === 'eslint-config-ckeditor5' ) {
				return Promise.resolve( '5.0.0' );
			}

			if ( packageName === 'eslint-plugin-ckeditor5-rules' ) {
				return Promise.resolve( '5.0.0' );
			}

			if ( packageName === 'stylelint-config-ckeditor5' ) {
				return Promise.resolve( '3.0.0' );
			}
		} );

		stubs = {
			logger: {
				process: vi.fn(),
				verboseInfo: vi.fn()
			}
		};
	} );

	it( 'should be a function', () => {
		expect( getDependenciesVersions ).toBeTypeOf( 'function' );
	} );

	it( 'logs the process', async () => {
		await getDependenciesVersions( stubs.logger );

		expect( stubs.logger.process ).toHaveBeenCalledTimes( 1 );
		expect( stubs.logger.process ).toHaveBeenCalledWith( 'Collecting the latest CKEditor 5 packages versions...' );
	} );

	it( 'returns an object with a version of the "ckeditor5" package', async () => {
		const returnedValue = await getDependenciesVersions( stubs.logger );
		expect( returnedValue.ckeditor5 ).toEqual( '30.0.0' );
	} );

	it( 'returns an object with a version of the "eslint-config-ckeditor5"', async () => {
		const returnedValue = await getDependenciesVersions( stubs.logger );
		expect( returnedValue.eslintConfigCkeditor5 ).toEqual( '5.0.0' );
	} );

	it( 'returns an object with a version of the "eslint-plugin-ckeditor5-rules"', async () => {
		const returnedValue = await getDependenciesVersions( stubs.logger );
		expect( returnedValue.eslintPluginCkeditor5Rules ).toEqual( '5.0.0' );
	} );

	it( 'returns an object with a version of the "stylelint-config-ckeditor5" package', async () => {
		const returnedValue = await getDependenciesVersions( stubs.logger );
		expect( returnedValue.stylelintConfigCkeditor5 ).toEqual( '3.0.0' );
	} );
} );

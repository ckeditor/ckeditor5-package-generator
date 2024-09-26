/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import path from 'path';
import { fileURLToPath } from 'url';
import getPackageVersion from '../../lib/utils/get-package-version.js';
import getDependenciesVersions from '../../lib/utils/get-dependencies-versions.js';

const __filename = fileURLToPath( import.meta.url );
const __dirname = path.dirname( __filename );

vi.mock( '../../lib/utils/get-package-version.js' );

describe( 'lib/utils/get-dependencies-versions', () => {
	let stubs;

	beforeEach( () => {
		vi.mocked( getPackageVersion ).mockImplementation( packageName => {
			if ( packageName === 'ckeditor5' ) {
				return '30.0.0';
			}

			if ( packageName === '@ckeditor/ckeditor5-package-tools' ) {
				return '1.0.0';
			}

			if ( packageName === '@ckeditor/ckeditor5-inspector' ) {
				return '4.0.0';
			}

			if ( packageName === 'eslint-config-ckeditor5' ) {
				return '5.0.0';
			}

			if ( packageName === 'stylelint-config-ckeditor5' ) {
				return '3.0.0';
			}
		} );

		stubs = {
			logger: {
				process: vi.fn()
			}
		};
	} );

	it( 'should be a function', () => {
		expect( getDependenciesVersions ).toBeTypeOf( 'function' );
	} );

	it( 'logs the process', () => {
		getDependenciesVersions( stubs.logger, false );

		expect( stubs.logger.process ).toHaveBeenCalledTimes( 1 );
		expect( stubs.logger.process ).toHaveBeenCalledWith( 'Collecting the latest CKEditor 5 packages versions...' );
	} );

	it( 'returns an object with a version of the "ckeditor5" package', () => {
		const returnedValue = getDependenciesVersions( stubs.logger, false );
		expect( returnedValue.ckeditor5 ).toEqual( '30.0.0' );
	} );

	it( 'returns an object with a version of the "eslint-config-ckeditor5', () => {
		const returnedValue = getDependenciesVersions( stubs.logger, false );
		expect( returnedValue.eslintConfigCkeditor5 ).toEqual( '5.0.0' );
	} );

	it( 'returns an object with a version of the "stylelint-config-ckeditor5" package', () => {
		const returnedValue = getDependenciesVersions( stubs.logger, false );
		expect( returnedValue.stylelintConfigCkeditor5 ).toEqual( '3.0.0' );
	} );

	it( 'returns an object with a version of the "@ckeditor/ckeditor5-package-tools" package', () => {
		const returnedValue = getDependenciesVersions( stubs.logger, false );
		expect( returnedValue.ckeditor5Inspector ).toEqual( '4.0.0' );
	} );

	it( 'returns an object with a version of the "@ckeditor/ckeditor5-package-tools" package if the "dev" option is disabled', () => {
		const returnedValue = getDependenciesVersions( stubs.logger, false );
		expect( returnedValue.packageTools ).toEqual( '^1.0.0' );
	} );

	it( 'it returns an absolute path to the "@ckeditor/ckeditor5-package-tools" package if the "dev" option is enabled', () => {
		const returnedValue = getDependenciesVersions( stubs.logger, true );

		const PROJECT_ROOT_DIRECTORY = path.join( __dirname, '..', '..', '..' );
		let packageTools = 'file:' + path.resolve( PROJECT_ROOT_DIRECTORY, 'ckeditor5-package-tools' );
		packageTools = packageTools.split( path.sep ).join( path.posix.sep );

		expect( returnedValue.packageTools ).toEqual( packageTools );
	} );
} );

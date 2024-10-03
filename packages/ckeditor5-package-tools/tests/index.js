/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi } from 'vitest';
import start from '../lib/tasks/start.js';
import dllBuild from '../lib/tasks/dll-build.js';
import translationsCollect from '../lib/tasks/translations-collect.js';
import translationsUpload from '../lib/tasks/translations-upload.js';
import translationsDownload from '../lib/tasks/translations-download.js';
import exportPackageAsJavaScript from '../lib/tasks/export-package-as-javascript.js';
import exportPackageAsTypeScript from '../lib/tasks/export-package-as-typescript.js';
import tasks from '../lib/index.js';

vi.mock( '../lib/tasks/start.js' );
vi.mock( '../lib/tasks/dll-build.js' );
vi.mock( '../lib/tasks/translations-collect.js' );
vi.mock( '../lib/tasks/translations-upload.js' );
vi.mock( '../lib/tasks/translations-download.js' );
vi.mock( '../lib/tasks/export-package-as-javascript.js' );
vi.mock( '../lib/tasks/export-package-as-typescript.js' );

describe( 'lib/index', () => {
	it( 'should be an object containing available tasks', () => {
		expect( tasks ).toBeTypeOf( 'object' );
	} );

	describe( '#start', () => {
		it( 'is available', () => {
			expect( tasks.start ).toBeTypeOf( 'function' );
		} );

		it( 'executes the proper function from the "tasks/" directory', () => {
			tasks.start();

			expect( start ).toBeCalledTimes( 1 );
		} );

		it( 'passes arguments directly to the function', () => {
			const options = { foo: 1, bar: true };
			tasks.start( options );

			expect( start ).toHaveBeenCalledWith( options );
		} );
	} );

	describe( '#dll:build', () => {
		it( 'is available', () => {
			expect( tasks[ 'dll:build' ] ).toBeTypeOf( 'function' );
		} );

		it( 'executes the proper function from the "tasks/" directory', () => {
			tasks[ 'dll:build' ]();

			expect( dllBuild ).toBeCalledTimes( 1 );
		} );

		it( 'passes arguments directly to the function', () => {
			const options = { foo: 1, bar: true };
			tasks[ 'dll:build' ]( options );

			expect( dllBuild ).toHaveBeenCalledWith( options );
		} );
	} );

	describe( '#translations:collect', () => {
		it( 'is available', () => {
			expect( tasks[ 'translations:collect' ] ).toBeTypeOf( 'function' );
		} );

		it( 'executes the proper function from the "tasks/" directory', () => {
			tasks[ 'translations:collect' ]();

			expect( translationsCollect ).toBeCalledTimes( 1 );
		} );

		it( 'passes arguments directly to the function', () => {
			const options = { foo: 1, bar: true };
			tasks[ 'translations:collect' ]( options );

			expect( translationsCollect ).toHaveBeenCalledWith( options );
		} );
	} );

	describe( '#translations:download', () => {
		it( 'is available', () => {
			expect( tasks[ 'translations:download' ] ).toBeTypeOf( 'function' );
		} );

		it( 'executes the proper function from the "tasks/" directory', () => {
			tasks[ 'translations:download' ]();

			expect( translationsDownload ).toBeCalledTimes( 1 );
		} );

		it( 'passes arguments directly to the function', () => {
			const options = { foo: 1, bar: true };
			tasks[ 'translations:download' ]( options );

			expect( translationsDownload ).toHaveBeenCalledWith( options );
		} );
	} );

	describe( '#translations:upload', () => {
		it( 'is available', () => {
			expect( tasks[ 'translations:upload' ] ).toBeTypeOf( 'function' );
		} );

		it( 'executes the proper function from the "tasks/" directory', () => {
			tasks[ 'translations:upload' ]();

			expect( translationsUpload ).toBeCalledTimes( 1 );
		} );

		it( 'passes arguments directly to the function', () => {
			const options = { foo: 1, bar: true };
			tasks[ 'translations:upload' ]( options );

			expect( translationsUpload ).toHaveBeenCalledWith( options );
		} );
	} );

	describe( '#export-package-as-javascript', () => {
		it( 'is available', () => {
			expect( tasks[ 'export-package-as-javascript' ] ).toBeTypeOf( 'function' );
		} );

		it( 'executes the proper function from the "tasks/" directory', () => {
			tasks[ 'export-package-as-javascript' ]();

			expect( exportPackageAsJavaScript ).toBeCalledTimes( 1 );
		} );

		it( 'passes arguments directly to the function', () => {
			const options = { foo: 1, bar: true };
			tasks[ 'export-package-as-javascript' ]( options );

			expect( exportPackageAsJavaScript ).toHaveBeenCalledWith( options );
		} );
	} );

	describe( '#export-package-as-typescript', () => {
		it( 'is available', () => {
			expect( tasks[ 'export-package-as-typescript' ] ).toBeTypeOf( 'function' );
		} );

		it( 'executes the proper function from the "tasks/" directory', () => {
			tasks[ 'export-package-as-typescript' ]();

			expect( exportPackageAsTypeScript ).toBeCalledTimes( 1 );
		} );

		it( 'passes arguments directly to the function', () => {
			const options = { foo: 1, bar: true };
			tasks[ 'export-package-as-typescript' ]( options );

			expect( exportPackageAsTypeScript ).toHaveBeenCalledWith( options );
		} );
	} );
} );

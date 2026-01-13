/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi } from 'vitest';
import start from '../lib/tasks/start.js';
import synchronizeTranslations from '../lib/tasks/synchronize-translations.js';
import exportPackageAsJavaScript from '../lib/tasks/export-package-as-javascript.js';
import exportPackageAsTypeScript from '../lib/tasks/export-package-as-typescript.js';
import tasks from '../lib/index.js';

vi.mock( '../lib/tasks/start.js' );
vi.mock( '../lib/tasks/synchronize-translations.js' );
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

	describe( '#translations:synchronize', () => {
		it( 'is available', () => {
			expect( tasks[ 'translations:synchronize' ] ).toBeTypeOf( 'function' );
		} );

		it( 'executes the proper function from the "tasks/" directory', () => {
			tasks[ 'translations:synchronize' ]();

			expect( synchronizeTranslations ).toBeCalledTimes( 1 );
		} );

		it( 'passes arguments directly to the function', () => {
			const options = { foo: 1, bar: true };
			tasks[ 'translations:synchronize' ]( options );

			expect( synchronizeTranslations ).toHaveBeenCalledWith( options );
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

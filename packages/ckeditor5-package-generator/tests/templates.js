/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import fs from 'node:fs';
import upath from 'upath';
import { describe, expect, it } from 'vitest';

const TEMPLATES_DIRECTORY = upath.join( import.meta.dirname, '..', 'lib', 'templates' );
const MINIMUM_CKEDITOR_VERSION = '>=48.0.0 || ^0.0.0-nightly || ^0.0.0-internal';

function readTemplate( ...pathSegments ) {
	return fs.readFileSync( upath.join( TEMPLATES_DIRECTORY, ...pathSegments ), 'utf8' );
}

describe( 'templates', () => {
	it( 'uses the configuration-based create() syntax in sample files', () => {
		const jsSample = readTemplate( 'js', 'sample', 'index.js.txt' );
		const tsSample = readTemplate( 'ts', 'sample', 'index.ts.txt' );

		expect( jsSample ).toContain( '.create( {' );
		expect( jsSample ).toContain( 'attachTo: document.querySelector( \'#editor\' )' );
		expect( jsSample ).not.toContain( '.create( document.getElementById( \'editor\' )' );

		expect( tsSample ).toContain( '.create( {' );
		expect( tsSample ).toContain( 'attachTo: document.querySelector<HTMLElement>( \'#editor\' )!' );
		expect( tsSample ).not.toContain( '.create( document.getElementById( \'editor\' )!' );
	} );

	it( 'uses the configuration-based create() syntax in generated tests', () => {
		const jsTest = readTemplate( 'js', 'tests', '_PLACEHOLDER_.js.txt' );
		const tsTest = readTemplate( 'ts', 'tests', '_PLACEHOLDER_.ts.txt' );

		expect( jsTest ).toContain( 'ClassicEditor.create( {' );
		expect( jsTest ).toContain( 'attachTo: domElement' );
		expect( jsTest ).not.toContain( 'ClassicEditor.create( domElement,' );

		expect( tsTest ).toContain( 'ClassicEditor.create( {' );
		expect( tsTest ).toContain( 'attachTo: domElement' );
		expect( tsTest ).not.toContain( 'ClassicEditor.create( domElement,' );
	} );

	it( 'requires CKEditor 5 v48 or newer in generated package peer dependencies', () => {
		const jsPackageJson = JSON.parse( readTemplate( 'js', 'package.json' ) );
		const tsPackageJson = JSON.parse( readTemplate( 'ts', 'package.json' ) );

		expect( jsPackageJson.peerDependencies[ '@ckeditor/ckeditor5-core' ] ).toBe( MINIMUM_CKEDITOR_VERSION );
		expect( jsPackageJson.peerDependencies.ckeditor5 ).toBe( MINIMUM_CKEDITOR_VERSION );

		expect( tsPackageJson.peerDependencies[ '@ckeditor/ckeditor5-core' ] ).toBe( MINIMUM_CKEDITOR_VERSION );
		expect( tsPackageJson.peerDependencies.ckeditor5 ).toBe( MINIMUM_CKEDITOR_VERSION );
	} );
} );

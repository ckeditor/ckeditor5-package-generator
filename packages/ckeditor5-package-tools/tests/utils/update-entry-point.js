/**
 * @license Copyright (c) 2020-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const sinon = require( 'sinon' );
const expect = require( 'chai' ).expect;
const mockery = require( 'mockery' );

describe( 'lib/utils/update-entry-point', () => {
	let updateEntryPoint, stubs, pkgJsonTS, pkgJsonJS;

	const cwd = '/process/cwd';

	beforeEach( () => {
		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

		pkgJsonTS = {
			'name': '@foo/ckeditor5-bar',
			'version': '0.0.1',
			'description': 'A plugin for CKEditor 5.',
			'main': 'src/index.ts',
			'license': 'MIT'
		};

		pkgJsonJS = {
			'name': '@foo/ckeditor5-bar',
			'version': '0.0.1',
			'description': 'A plugin for CKEditor 5.',
			'main': 'src/index.js',
			'license': 'MIT'
		};

		stubs = {
			path: {
				join: sinon.stub().callsFake( ( ...chunks ) => chunks.join( '/' ) )
			},
			devUtils: {
				tools: {
					updateJSONFile: sinon.stub()
				}
			}
		};

		mockery.registerMock( 'path', stubs.path );
		mockery.registerMock( '@ckeditor/ckeditor5-dev-utils', stubs.devUtils );

		updateEntryPoint = require( '../../lib/utils/update-entry-point' );
	} );

	afterEach( () => {
		sinon.restore();
		mockery.disable();
	} );

	it( 'should be a function', () => {
		expect( updateEntryPoint ).to.be.a( 'function' );
	} );

	it( 'updates the "main" field to point to a js file', () => {
		updateEntryPoint( { cwd }, 'js' );

		expect( stubs.devUtils.tools.updateJSONFile.callCount ).to.equal( 1 );
		expect( stubs.devUtils.tools.updateJSONFile.getCall( 0 ).args[ 0 ] ).to.equal( '/process/cwd/package.json' );
		expect( stubs.devUtils.tools.updateJSONFile.getCall( 0 ).args[ 1 ] ).to.be.a( 'function' );

		const callback = stubs.devUtils.tools.updateJSONFile.getCall( 0 ).args[ 1 ];

		expect( callback( pkgJsonTS ) ).to.deep.equal( pkgJsonJS );
	} );

	it( 'updates the "main" field to point to a ts file', () => {
		updateEntryPoint( { cwd }, 'ts' );

		expect( stubs.devUtils.tools.updateJSONFile.callCount ).to.equal( 1 );
		expect( stubs.devUtils.tools.updateJSONFile.getCall( 0 ).args[ 0 ] ).to.equal( '/process/cwd/package.json' );
		expect( stubs.devUtils.tools.updateJSONFile.getCall( 0 ).args[ 1 ] ).to.be.a( 'function' );

		const callback = stubs.devUtils.tools.updateJSONFile.getCall( 0 ).args[ 1 ];

		expect( callback( pkgJsonJS ) ).to.deep.equal( pkgJsonTS );
	} );

	it( 'keeps the "main" field unchanged if it points to a file with the same extension as the argument received', () => {
		updateEntryPoint( { cwd }, 'js' );

		expect( stubs.devUtils.tools.updateJSONFile.callCount ).to.equal( 1 );
		expect( stubs.devUtils.tools.updateJSONFile.getCall( 0 ).args[ 0 ] ).to.equal( '/process/cwd/package.json' );
		expect( stubs.devUtils.tools.updateJSONFile.getCall( 0 ).args[ 1 ] ).to.be.a( 'function' );

		const callback = stubs.devUtils.tools.updateJSONFile.getCall( 0 ).args[ 1 ];

		expect( callback( pkgJsonJS ) ).to.deep.equal( pkgJsonJS );
	} );
} );

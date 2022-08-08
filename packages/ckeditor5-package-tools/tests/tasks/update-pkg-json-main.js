/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const sinon = require( 'sinon' );
const expect = require( 'chai' ).expect;
const mockery = require( 'mockery' );

describe( 'lib/tasks/update-pkg-json-main', () => {
	let updatePkgJsonMain, stubs;

	const cwd = '/process/cwd';

	beforeEach( () => {
		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

		stubs = {
			path: {
				join: sinon.stub().callsFake( ( ...chunks ) => chunks.join( '/' ) )
			},
			fs: {
				readFileSync: sinon.stub(),
				writeFileSync: sinon.stub()
			}
		};

		mockery.registerMock( 'path', stubs.path );
		mockery.registerMock( 'fs', stubs.fs );

		updatePkgJsonMain = require( '../../lib/tasks/update-pkg-json-main' );
	} );

	afterEach( () => {
		sinon.restore();
		mockery.disable();
	} );

	it( 'should be a function', () => {
		expect( updatePkgJsonMain ).to.be.a( 'function' );
	} );

	it( 'updates main field in package.json file to point to a js file', () => {
		const pkgJson = {
			'name': '@przemyslaw-zan/ckeditor5-test-package-4',
			'version': '0.0.1',
			'description': 'A plugin for CKEditor 5.',
			'main': 'src/index.ts',
			'license': 'MIT'
		};

		stubs.fs.readFileSync
			.withArgs( `${ cwd }/package.json`, 'utf-8' )
			.returns( JSON.stringify( pkgJson, null, 2 ) + '\n' );

		updatePkgJsonMain( { cwd, _: [ 'js' ] } );

		expect( stubs.fs.writeFileSync.callCount ).to.equal( 1 );
		expect( stubs.fs.writeFileSync.getCall( 0 ).args[ 1 ] ).to.equal( [
			'{',
			'  "name": "@przemyslaw-zan/ckeditor5-test-package-4",',
			'  "version": "0.0.1",',
			'  "description": "A plugin for CKEditor 5.",',
			'  "main": "src/index.js",',
			'  "license": "MIT"',
			'}',
			''
		].join( '\n' ) );
	} );

	it( 'updates main field in package.json file to point to a ts file', () => {
		const pkgJson = {
			'name': '@przemyslaw-zan/ckeditor5-test-package-4',
			'version': '0.0.1',
			'description': 'A plugin for CKEditor 5.',
			'main': 'src/index.js',
			'license': 'MIT'
		};

		stubs.fs.readFileSync
			.withArgs( `${ cwd }/package.json`, 'utf-8' )
			.returns( JSON.stringify( pkgJson, null, 2 ) + '\n' );

		updatePkgJsonMain( { cwd, _: [ 'ts' ] } );

		expect( stubs.fs.writeFileSync.callCount ).to.equal( 1 );
		expect( stubs.fs.writeFileSync.getCall( 0 ).args[ 1 ] ).to.equal( [
			'{',
			'  "name": "@przemyslaw-zan/ckeditor5-test-package-4",',
			'  "version": "0.0.1",',
			'  "description": "A plugin for CKEditor 5.",',
			'  "main": "src/index.ts",',
			'  "license": "MIT"',
			'}',
			''
		].join( '\n' ) );
	} );
} );

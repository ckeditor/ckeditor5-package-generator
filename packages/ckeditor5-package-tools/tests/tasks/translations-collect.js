/**
 * @license Copyright (c) 2020-2022, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const sinon = require( 'sinon' );
const expect = require( 'chai' ).expect;
const mockery = require( 'mockery' );

describe( 'lib/tasks/translations-collect', () => {
	let translationsCollect, stubs;

	beforeEach( () => {
		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

		stubs = {
			devEnv: {
				createPotFiles: sinon.stub()
			},
			path: {
				join: sinon.stub().callsFake( ( ...chunks ) => chunks.join( '/' ) )
			},
			glob: {
				sync: sinon.stub()
			}
		};

		mockery.registerMock( 'path', stubs.path );
		mockery.registerMock( 'glob', stubs.glob );
		mockery.registerMock( '@ckeditor/ckeditor5-dev-env', stubs.devEnv );

		translationsCollect = require( '../../lib/tasks/translations-collect' );
	} );

	afterEach( () => {
		sinon.restore();
		mockery.disable();
	} );

	it( 'should be a function', () => {
		expect( translationsCollect ).to.be.a( 'function' );
	} );

	it( 'creates translation files', () => {
		const sourceFiles = [
			'/workspace/ckeditor5-foo/src/index.js',
			'/workspace/ckeditor5-foo/src/myplugin.js'
		];

		stubs.glob.sync.returns( sourceFiles );
		stubs.devEnv.createPotFiles.returns( 'OK' );

		const results = translationsCollect( {
			cwd: '/workspace'
		} );

		expect( results ).to.equal( 'OK' );

		expect( stubs.glob.sync.calledOnce ).to.equal( true );
		expect( stubs.glob.sync.firstCall.firstArg ).to.equal( '/workspace/src/**/*.js' );

		expect( stubs.devEnv.createPotFiles.calledOnce ).to.equal( true );
		expect( stubs.devEnv.createPotFiles.firstCall.firstArg ).to.deep.equal( {
			// Verify results returned by `glob.sync()`.
			sourceFiles,
			// Verify a path to the `@ckeditor/ckeditor5-core` package.
			corePackagePath: 'node_modules/@ckeditor/ckeditor5-core',
			// Verify ignoring unused contexts from the `@ckeditor/ckeditor5-core` package.
			ignoreUnusedCorePackageContexts: true,
			// Verify a path where to look for packages.
			packagePaths: [
				'/workspace'
			],
			// Verify the license header in translation files.
			skipLicenseHeader: true,
			// Verify a path where translations will be stored.
			translationsDirectory: '/workspace/tmp/.transifex'
		} );
	} );

	it( 'passes posix paths to glob', () => {
		stubs.devEnv.createPotFiles.returns( 'OK' );

		const results = translationsCollect( {
			cwd: 'C:\\workspace'
		} );

		expect( results ).to.equal( 'OK' );

		expect( stubs.glob.sync.calledOnce ).to.equal( true );
		expect( stubs.glob.sync.firstCall.firstArg ).to.equal( 'C:/workspace/src/**/*.js' );
	} );
} );

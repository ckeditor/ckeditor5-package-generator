/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

const mockery = require( 'mockery' );
const sinon = require( 'sinon' );
const { expect } = require( 'chai' );

describe( 'lib/utils/create-directory', () => {
	let stubs,
		createDirectory;

	beforeEach( () => {
		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

		stubs = {
			chalk: {
				cyan: sinon.stub().callsFake( str => str )
			},
			fs: {
				existsSync: sinon.stub().returns( false )
			},
			mkdirp: {
				sync: sinon.stub()
			},
			path: {
				resolve: sinon.stub().callsFake( ( ...args ) => [ 'resolved', ...args ].join( '/' ) )
			},
			logger: {
				process: sinon.stub(),
				error: sinon.stub()
			},
			process: {
				exit: sinon.stub( process, 'exit' )
			}
		};

		mockery.registerMock( 'chalk', stubs.chalk );
		mockery.registerMock( 'fs', stubs.fs );
		mockery.registerMock( 'mkdirp', stubs.mkdirp );
		mockery.registerMock( 'path', stubs.path );

		createDirectory = require( '../../lib/utils/create-directory' );
	} );

	afterEach( () => {
		mockery.deregisterAll();
		mockery.disable();
		sinon.restore();
	} );

	it( 'should be a function', () => {
		expect( createDirectory ).to.be.a( 'function' );
	} );

	it( 'logs the process', () => {
		createDirectory( stubs.logger, '@foo/ckeditor5-bar' );

		expect( stubs.logger.process.callCount ).to.equal( 2 );
		expect( stubs.logger.process.getCall( 0 ).args[ 0 ] ).to.equal( 'Checking whether the "ckeditor5-bar" directory can be created.' );
		expect( stubs.logger.process.getCall( 1 ).args[ 0 ] ).to.equal( 'Creating the directory "resolved/ckeditor5-bar".' );
	} );

	it( 'creates the directory', () => {
		createDirectory( stubs.logger, '@foo/ckeditor5-bar' );

		expect( stubs.mkdirp.sync.callCount ).to.equal( 1 );
		expect( stubs.mkdirp.sync.getCall( 0 ).args[ 0 ] ).to.equal( 'resolved/ckeditor5-bar' );
	} );

	it( 'logs an error and exits the process if the directory already exists', () => {
		stubs.fs.existsSync.returns( true );

		createDirectory( stubs.logger, '@foo/ckeditor5-bar' );

		expect( stubs.logger.error.callCount ).to.equal( 2 );
		expect( stubs.logger.error.getCall( 0 ).args[ 0 ] ).to.equal( 'Cannot create a directory as the location is already taken.' );
		expect( stubs.logger.error.getCall( 1 ).args[ 0 ] ).to.equal( 'Aborting.' );

		expect( stubs.process.exit.callCount ).to.equal( 1 );
	} );

	it( 'returns directory name and path', () => {
		const result = createDirectory( stubs.logger, '@foo/ckeditor5-bar' );

		expect( result ).to.deep.equal( {
			directoryName: 'ckeditor5-bar',
			directoryPath: 'resolved/ckeditor5-bar'
		} );
	} );
} );

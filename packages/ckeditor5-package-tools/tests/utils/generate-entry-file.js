/**
 * @license Copyright (c) 2020-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const sinon = require( 'sinon' );
const expect = require( 'chai' ).expect;
const mockery = require( 'mockery' );

describe( 'lib/utils/generate-entry-file', () => {
	let generateEntryFile, clock, stubs;

	beforeEach( () => {
		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

		clock = sinon.useFakeTimers();

		stubs = {
			fs: {
				writeFileSync: sinon.stub(),
				utimesSync: sinon.stub()
			},
			path: {
				join: sinon.stub().callsFake( ( ...chunks ) => chunks.join( '/' ) ),
				sep: sinon.stub().returns( '/' ),
				dirname: sinon.stub().callsFake( file => file.split( '/' ).slice( 0, -1 ).join( '/' ) ),
				resolve: sinon.stub().callsFake( file => `/process/cwd/${ file }` ),
				posix: {
					sep: sinon.stub().returns( '/' )
				}
			},
			mkdirp: {
				sync: sinon.stub()
			},
			glob: {
				sync: sinon.stub()
			}
		};

		mockery.registerMock( 'fs', stubs.fs );
		mockery.registerMock( 'path', stubs.path );
		mockery.registerMock( 'mkdirp', stubs.mkdirp );
		mockery.registerMock( 'glob', stubs.glob );

		sinon.stub( console, 'info' );

		generateEntryFile = require( '../../lib/utils/generate-entry-file' );
	} );

	afterEach( () => {
		sinon.restore();
		clock.restore();
		mockery.disable();
	} );

	it( 'should be a function', () => {
		expect( generateEntryFile ).to.be.a( 'function' );
	} );

	it( 'should create a directory for the specified file', () => {
		stubs.glob.sync.returns( [] );

		generateEntryFile( '/Users/ckeditor/ckeditor5-foo/tmp/tests-entry-point.js' );

		expect( stubs.mkdirp.sync.calledOnce ).to.equal( true );
		expect( stubs.mkdirp.sync.firstCall.args[ 0 ] ).to.equal( '/Users/ckeditor/ckeditor5-foo/tmp' );
	} );

	it( 'should find *.js and *.ts files in the "tests/" directory', () => {
		stubs.glob.sync.returns( [] );

		generateEntryFile( '/Users/ckeditor/ckeditor5-foo/tmp/tests-entry-point.js' );

		expect( stubs.glob.sync.calledOnce ).to.equal( true );
		expect( stubs.glob.sync.firstCall.args[ 0 ] ).to.equal( 'tests/**/*.[jt]s' );
		expect( stubs.glob.sync.firstCall.args[ 1 ] ).to.deep.equal( { nodir: true } );
	} );

	it( 'should create an empty file if no tests found', () => {
		stubs.glob.sync.returns( [] );

		generateEntryFile( '/Users/ckeditor/ckeditor5-foo/tmp/tests-entry-point.js' );

		expect( stubs.fs.writeFileSync.calledOnce ).to.equal( true );
		expect( stubs.fs.writeFileSync.firstCall.args[ 0 ] ).to.equal( '/Users/ckeditor/ckeditor5-foo/tmp/tests-entry-point.js' );
		expect( stubs.fs.writeFileSync.firstCall.args[ 1 ] ).to.equal( '' );

		expect( console.info.calledOnce ).to.equal( true );
		expect( console.info.firstCall.args[ 0 ] ).to.equal( 'Entry file saved in "%s".' );
		expect( console.info.firstCall.args[ 1 ] ).to.equal( '/Users/ckeditor/ckeditor5-foo/tmp/tests-entry-point.js' );
	} );

	it( 'should create an entry file with absolute paths to found *.js and *.ts tests', () => {
		stubs.glob.sync.returns( [
			'tests/1.js',
			'tests/foo/2.js',
			'tests/bar/3.ts'
		] );

		generateEntryFile( '/Users/ckeditor/ckeditor5-foo/tmp/tests-entry-point.js' );

		expect( stubs.fs.writeFileSync.calledOnce ).to.equal( true );
		expect( stubs.fs.writeFileSync.firstCall.args[ 0 ] ).to.equal( '/Users/ckeditor/ckeditor5-foo/tmp/tests-entry-point.js' );
		expect( stubs.fs.writeFileSync.firstCall.args[ 1 ] ).to.equal(
			'import \'/process/cwd/tests/1.js\';\n' +
			'import \'/process/cwd/tests/foo/2.js\';\n' +
			'import \'/process/cwd/tests/bar/3.ts\';\n'
		);
	} );

	// See: https://github.com/ckeditor/ckeditor5/issues/7068.
	it( 'should update the "modified" time for created file for preventing calling tests many times in a row', () => {
		stubs.glob.sync.returns( [] );

		// 2021-09-02T06:50:03.337Z
		clock.tick( 1630565403337 );

		generateEntryFile( '/Users/ckeditor/ckeditor5-foo/tmp/tests-entry-point.js' );

		expect( stubs.fs.utimesSync.calledOnce ).to.equal( true );
		expect( stubs.fs.utimesSync.firstCall.args[ 0 ] ).to.equal( '/Users/ckeditor/ckeditor5-foo/tmp/tests-entry-point.js' );
		expect( stubs.fs.utimesSync.firstCall.args[ 1 ] ).to.equal( 1630565393.337 );
		expect( stubs.fs.utimesSync.firstCall.args[ 2 ] ).to.equal( 1630565393.337 );
	} );
} );

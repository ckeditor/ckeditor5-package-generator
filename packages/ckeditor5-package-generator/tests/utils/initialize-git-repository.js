/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

const mockery = require( 'mockery' );
const sinon = require( 'sinon' );
const { expect } = require( 'chai' );

describe( 'lib/utils/initialize-git-repository', () => {
	let stubs,
		initializeGitRepository;

	const directoryPath = 'directory/path/foo';

	beforeEach( () => {
		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

		stubs = {
			path: {
				join: sinon.stub().callsFake( ( ...args ) => args.join( '/' ) )
			},
			fs: {
				removeSync: sinon.stub()
			},
			childProcess: {
				execSync: sinon.stub()
			},
			logger: {
				process: sinon.stub()
			}
		};

		mockery.registerMock( 'path', stubs.path );
		mockery.registerMock( 'fs', stubs.fs );
		mockery.registerMock( 'child_process', stubs.childProcess );

		initializeGitRepository = require( '../../lib/utils/initialize-git-repository' );
	} );

	afterEach( () => {
		mockery.disable();
	} );

	it( 'should be a function', () => {
		expect( initializeGitRepository ).to.be.a( 'function' );
	} );

	it( 'logs the process', () => {
		initializeGitRepository( directoryPath, stubs.logger );

		expect( stubs.logger.process.callCount ).to.equal( 1 );
		expect( stubs.logger.process.getCall( 0 ).args[ 0 ] ).to.equal( 'Initializing Git repository...' );
	} );

	it( 'initializes the repository', () => {
		initializeGitRepository( directoryPath, stubs.logger );

		expect( stubs.childProcess.execSync.callCount ).to.equal( 3 );
		expect( stubs.childProcess.execSync.getCall( 0 ).args ).to.deep.equal( [
			'git init',
			{ stdio: 'ignore', cwd: directoryPath }
		] );
	} );

	it( 'commits files to the repository', () => {
		initializeGitRepository( directoryPath, stubs.logger );

		expect( stubs.childProcess.execSync.callCount ).to.equal( 3 );
		expect( stubs.childProcess.execSync.getCall( 1 ).args ).to.deep.equal( [
			'git add -A',
			{ stdio: 'ignore', cwd: directoryPath }
		] );
		expect( stubs.childProcess.execSync.getCall( 2 ).args ).to.deep.equal( [
			'git commit -m "Initialize the repository using CKEditor 5 Package Generator."',
			{ stdio: 'ignore', cwd: directoryPath }
		] );
	} );

	it( 'in case of an error during committing, removes the .git directory', () => {
		stubs.childProcess.execSync.onThirdCall().throws( new Error( 'Custom error message.' ) );

		initializeGitRepository( directoryPath, stubs.logger );

		expect( stubs.fs.removeSync.callCount ).to.equal( 1 );
		expect( stubs.fs.removeSync.getCall( 0 ).args[ 0 ] ).to.equal( 'directory/path/foo/.git' );
	} );
} );

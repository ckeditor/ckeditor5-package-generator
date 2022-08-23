/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

const mockery = require( 'mockery' );
const sinon = require( 'sinon' );
const { expect } = require( 'chai' );

describe( 'lib/utils/install-git-hooks', () => {
	let options, stubs, installGitHooks;

	const directoryPath = 'directory/path/foo';

	beforeEach( () => {
		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

		options = {
			verbose: false
		};

		stubs = {
			childProcess: {
				spawn: sinon.stub()
			},
			logger: {
				process: sinon.stub()
			},
			rebuildTask: {
				on: sinon.stub()
			}
		};

		stubs.childProcess.spawn.returns( stubs.rebuildTask );

		mockery.registerMock( 'child_process', stubs.childProcess );

		installGitHooks = require( '../../lib/utils/install-git-hooks' );
	} );

	afterEach( () => {
		mockery.disable();
	} );

	it( 'should be a function', () => {
		expect( installGitHooks ).to.be.a( 'function' );
	} );

	it( 'logs the process', async () => {
		await runTest( directoryPath, stubs.logger, options, 0 );

		expect( stubs.logger.process.callCount ).to.equal( 1 );
		expect( stubs.logger.process.getCall( 0 ).args[ 0 ] ).to.equal( 'Installing Git hooks...' );
	} );

	it( 'installs git hooks', async () => {
		await runTest( directoryPath, stubs.logger, options, 0 );

		expect( stubs.childProcess.spawn.callCount ).to.equal( 1 );
		expect( stubs.childProcess.spawn.getCall( 0 ).args ).to.deep.equal( [
			'npm',
			[
				'rebuild',
				'husky'
			],
			{
				encoding: 'utf8',
				shell: true,
				cwd: directoryPath,
				stderr: 'inherit'
			}
		] );
	} );

	it( 'installs git hooks in verbose mode', async () => {
		options.verbose = true;

		await runTest( directoryPath, stubs.logger, options, 0 );

		expect( stubs.childProcess.spawn.callCount ).to.equal( 1 );
		expect( stubs.childProcess.spawn.getCall( 0 ).args ).to.deep.equal( [
			'npm',
			[
				'rebuild',
				'husky'
			],
			{
				encoding: 'utf8',
				shell: true,
				cwd: directoryPath,
				stderr: 'inherit',
				stdio: 'inherit'
			}
		] );
	} );

	it( 'throws an error when install task closes with error exit code', () => {
		return runTest( directoryPath, stubs.logger, options, 1 )
			.then( () => {
				throw new Error( 'Expected to throw.' );
			} )
			.catch( err => {
				expect( err.message ).to.equal( 'Rebuilding finished with an error.' );
			} );
	} );

	/**
	 * This function allows execution of following code block:
	 *
	 * rebuildTask.on( 'close', exitCode => {
	 *
	 * It is needed to run the test properly, as that block
	 * is a callback that executes resolve() and reject().
	 *
	 * @param {String} directoryPath
	 * @param {Object} options
	 * @param {Number} exitCode
	 */
	async function runTest( directoryPath, logger, options, exitCode ) {
		const promise = installGitHooks( directoryPath, logger, options );
		const rebuildTaskCloseCallback = stubs.rebuildTask.on.getCall( 0 ).args[ 1 ];
		await rebuildTaskCloseCallback( exitCode );

		return promise;
	}
} );

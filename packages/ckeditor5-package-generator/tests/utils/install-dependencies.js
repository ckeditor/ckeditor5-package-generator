/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

const mockery = require( 'mockery' );
const sinon = require( 'sinon' );
const { expect } = require( 'chai' );

describe( 'lib/utils/install-dependencies', () => {
	let defaultDirectoryPath, defaultOptions, stubs, installDependencies;

	beforeEach( () => {
		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

		defaultDirectoryPath = 'directory/path/foo';

		defaultOptions = {
			verbose: false,
			dev: false
		};

		stubs = {
			devUtils: {
				tools: {
					createSpinner: sinon.stub()
				}
			},
			spinner: {
				start: sinon.stub(),
				finish: sinon.stub()
			},
			chalk: {
				gray: {
					italic: sinon.stub().callsFake( str => str )
				}
			},
			childProcess: {
				spawn: sinon.stub()
			},
			installTask: {
				on: sinon.stub()
			}
		};

		stubs.devUtils.tools.createSpinner.returns( stubs.spinner );
		stubs.childProcess.spawn.returns( stubs.installTask );

		mockery.registerMock( '@ckeditor/ckeditor5-dev-utils', stubs.devUtils );
		mockery.registerMock( 'chalk', stubs.chalk );
		mockery.registerMock( 'child_process', stubs.childProcess );

		installDependencies = require( '../../lib/utils/install-dependencies' );
	} );

	afterEach( () => {
		mockery.disable();
	} );

	it( 'should be a function', () => {
		expect( installDependencies ).to.be.a( 'function' );
	} );

	it( 'creates and removes the spinner', async () => {
		await runTest( {} );

		expect( stubs.devUtils.tools.createSpinner.callCount ).to.equal( 1 );
		expect( stubs.spinner.start.callCount ).to.equal( 1 );
		expect( stubs.spinner.finish.callCount ).to.equal( 1 );

		expect( stubs.devUtils.tools.createSpinner.getCall( 0 ).args ).to.deep.equal( [
			'Installing dependencies... It takes a while.',
			{ isDisabled: false }
		] );
	} );

	it( 'installs dependencies using yarn', async () => {
		await runTest( {} );

		expect( stubs.childProcess.spawn.callCount ).to.equal( 1 );
		expect( stubs.childProcess.spawn.getCall( 0 ).args ).to.deep.equal( [
			'yarnpkg',
			[
				'--cwd',
				defaultDirectoryPath
			],
			{
				encoding: 'utf8',
				shell: true,
				cwd: defaultDirectoryPath,
				stderr: 'inherit'
			}
		] );
	} );

	it( 'installs dependencies using yarn in verbose mode', async () => {
		await runTest( {
			options: { verbose: true, dev: false }
		} );

		expect( stubs.childProcess.spawn.callCount ).to.equal( 1 );
		expect( stubs.childProcess.spawn.getCall( 0 ).args ).to.deep.equal( [
			'yarnpkg',
			[
				'--cwd',
				defaultDirectoryPath
			],
			{
				encoding: 'utf8',
				shell: true,
				cwd: defaultDirectoryPath,
				stderr: 'inherit',
				stdio: 'inherit'
			}
		] );
	} );

	it( 'installs dependencies using npm', async () => {
		await runTest( {
			packageManager: 'npm'
		} );

		expect( stubs.childProcess.spawn.callCount ).to.equal( 1 );
		expect( stubs.childProcess.spawn.getCall( 0 ).args ).to.deep.equal( [
			'npm',
			[
				'install',
				'--prefix',
				defaultDirectoryPath
			],
			{
				encoding: 'utf8',
				shell: true,
				cwd: defaultDirectoryPath,
				stderr: 'inherit'
			}
		] );
	} );

	it( 'installs dependencies using npm in verbose mode', async () => {
		await runTest( {
			packageManager: 'npm',
			options: { verbose: true, dev: false }
		} );

		expect( stubs.childProcess.spawn.callCount ).to.equal( 1 );
		expect( stubs.childProcess.spawn.getCall( 0 ).args ).to.deep.equal( [
			'npm',
			[
				'install',
				'--prefix',
				defaultDirectoryPath
			],
			{
				encoding: 'utf8',
				shell: true,
				cwd: defaultDirectoryPath,
				stderr: 'inherit',
				stdio: 'inherit'
			}
		] );
	} );

	it( 'uses --install-links flag using npm in dev mode', async () => {
		await runTest( {
			packageManager: 'npm',
			options: { verbose: true, dev: true }
		} );

		expect( stubs.childProcess.spawn.getCall( 0 ).args[ 1 ].includes( '--install-links' ) ).to.equal( true );
	} );

	it( 'throws an error when install task closes with error exit code', () => {
		return runTest( {
			exitCode: 1
		} )
			.then( () => {
				throw new Error( 'Expected to throw.' );
			} )
			.catch( err => {
				expect( err.message ).to.equal( 'Installing dependencies finished with an error.' );
			} );
	} );

	/**
	 * This function allows execution of following code block:
	 *
	 * installTask.on( 'close', exitCode => {
	 *
	 * It is needed to run the test properly, as that block
	 * is a callback that executes resolve() and reject().
	 *
	 * @param {Object} options
	 */
	async function runTest( { packageManager = 'yarn', options = defaultOptions, exitCode = 0 } ) {
		const promise = installDependencies( defaultDirectoryPath, packageManager, options );
		const installTaskCloseCallback = stubs.installTask.on.getCall( 0 ).args[ 1 ];
		await installTaskCloseCallback( exitCode );

		return promise;
	}
} );

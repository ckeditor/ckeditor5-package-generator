/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

const mockery = require( 'mockery' );
const sinon = require( 'sinon' );
const { expect } = require( 'chai' );

describe( 'lib/utils/install-dependencies', () => {
	let verbose, stubs, installDependencies;

	const directoryPath = 'directory/path/foo';

	beforeEach( () => {
		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

		verbose = false;

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
		await runTest( directoryPath, verbose, 0 );

		expect( stubs.devUtils.tools.createSpinner.callCount ).to.equal( 1 );
		expect( stubs.spinner.start.callCount ).to.equal( 1 );
		expect( stubs.spinner.finish.callCount ).to.equal( 1 );

		expect( stubs.devUtils.tools.createSpinner.getCall( 0 ).args ).to.deep.equal( [
			'Installing dependencies... It takes a while.',
			{ isDisabled: false }
		] );
	} );

	it( 'installs dependencies using yarn', async () => {
		await runTest( directoryPath, verbose, 0 );

		expect( stubs.childProcess.spawn.callCount ).to.equal( 1 );
		expect( stubs.childProcess.spawn.getCall( 0 ).args ).to.deep.equal( [
			'yarnpkg',
			[
				'--cwd',
				directoryPath
			],
			{
				encoding: 'utf8',
				shell: true,
				cwd: directoryPath,
				stderr: 'inherit'
			}
		] );
	} );

	it( 'installs dependencies using yarn in verbose mode', async () => {
		await runTest( directoryPath, true, 0 );

		expect( stubs.childProcess.spawn.callCount ).to.equal( 1 );
		expect( stubs.childProcess.spawn.getCall( 0 ).args ).to.deep.equal( [
			'yarnpkg',
			[
				'--cwd',
				directoryPath
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

	it( 'installs dependencies using npm', async () => {
		await runTest( directoryPath, verbose, 0, 'npm' );

		expect( stubs.childProcess.spawn.callCount ).to.equal( 1 );
		expect( stubs.childProcess.spawn.getCall( 0 ).args ).to.deep.equal( [
			'npm',
			[
				'install',
				'--prefix',
				directoryPath
			],
			{
				encoding: 'utf8',
				shell: true,
				cwd: directoryPath,
				stderr: 'inherit'
			}
		] );
	} );

	it( 'installs dependencies using npm in verbose mode', async () => {
		await runTest( directoryPath, true, 0, 'npm' );

		expect( stubs.childProcess.spawn.callCount ).to.equal( 1 );
		expect( stubs.childProcess.spawn.getCall( 0 ).args ).to.deep.equal( [
			'npm',
			[
				'install',
				'--prefix',
				directoryPath
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

	it( 'uses --install-links flag using npm in dev mode', async () => {
		await runTest( directoryPath, true, 0, 'npm', true );

		expect( stubs.childProcess.spawn.getCall( 0 ).args[ 1 ].includes( '--install-links' ) ).to.equal( true );
	} );

	it( 'throws an error when install task closes with error exit code', () => {
		return runTest( directoryPath, verbose, 1 )
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
	 * @param {String} directoryPath
	 * @param {Object} options
	 * @param {Number} exitCode
	 * @param {'npm'|'yarn'} packageManager
	 */
	async function runTest( directoryPath, options, exitCode, packageManager = 'yarn', isDevModeFlagUsed = false ) {
		const promise = installDependencies( directoryPath, options, packageManager, isDevModeFlagUsed );
		const installTaskCloseCallback = stubs.installTask.on.getCall( 0 ).args[ 1 ];
		await installTaskCloseCallback( exitCode );

		return promise;
	}
} );

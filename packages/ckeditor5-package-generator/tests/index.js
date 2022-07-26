/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

const mockery = require( 'mockery' );
const sinon = require( 'sinon' );
const { expect } = require( 'chai' );

describe( 'lib/index', () => {
	let originalArgv, stubs, Logger;

	beforeEach( () => {
		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

		originalArgv = process.argv;

		process.argv = [ 'node', 'path/to/index.js' ];

		stubs = {
			chalk: {
				underline: sinon.stub().callsFake( str => str ),
				green: sinon.stub().callsFake( str => str ),
				cyan: sinon.stub().callsFake( str => str ),
				gray: sinon.stub().callsFake( str => str )
			},
			fs: {
				existsSync: sinon.stub().returns( true )
			},
			path: {
				// This replace() removes the ( __dirname, '..' ) part from the path.
				join: sinon.stub().callsFake( ( ...args ) => args.join( '/' ).replace( /^.+\.\.\//, '' ) )
			},
			chooseProgrammingLanguage: sinon.stub(),
			copyFiles: sinon.stub(),
			createDirectory: sinon.stub(),
			getDependenciesVersions: sinon.stub(),
			getDllConfiguration: sinon.stub(),
			initializeGitRepository: sinon.stub(),
			installDependencies: sinon.stub(),
			installGitHooks: sinon.stub(),
			validatePackageName: sinon.stub(),
			logger: {
				info: sinon.stub()
			}
		};

		stubs.createDirectory.returns( {
			directoryName: 'directoryName',
			directoryPath: 'directoryPath'
		} );
		stubs.chooseProgrammingLanguage.resolves( 'js' );
		stubs.getDependenciesVersions.returns( {
			ckeditor5: '30.0.0'
		} );
		stubs.getDllConfiguration.returns( {
			library: 'feature',
			fileName: 'feature.js'
		} );
		stubs.installDependencies.resolves();
		stubs.installGitHooks.resolves();
		stubs.initializeGitRepository.returns();

		Logger = class Logger {
			constructor( verbose ) {
				this.verbose = verbose;
				this.info = stubs.logger.info;
			}
		};

		mockery.registerMock( 'chalk', stubs.chalk );
		mockery.registerMock( 'fs', stubs.fs );
		mockery.registerMock( 'path', stubs.path );

		mockery.registerMock( './utils/logger', Logger );

		mockery.registerMock( './utils/choose-programming-language', stubs.chooseProgrammingLanguage );
		mockery.registerMock( './utils/copy-files', stubs.copyFiles );
		mockery.registerMock( './utils/create-directory', stubs.createDirectory );
		mockery.registerMock( './utils/get-dependencies-versions', stubs.getDependenciesVersions );
		mockery.registerMock( './utils/get-dll-configuration', stubs.getDllConfiguration );
		mockery.registerMock( './utils/initialize-git-repository', stubs.initializeGitRepository );
		mockery.registerMock( './utils/install-dependencies', stubs.installDependencies );
		mockery.registerMock( './utils/install-git-hooks', stubs.installGitHooks );
		mockery.registerMock( './utils/validate-package-name', stubs.validatePackageName );

		mockery.registerMock( '../package.json', { name: 'package.json name' } );
	} );

	afterEach( () => {
		mockery.deregisterAll();
		mockery.disable();
		sinon.restore();

		process.argv = originalArgv;
	} );

	it( 'passes correct arguments to the validatePackageName()', async () => {
		process.argv = [ 'node', 'path/to/index.js', '@scope/ckeditor5-feature' ];

		await require( '../lib/index' );

		expect( stubs.validatePackageName.callCount ).to.equal( 1 );
		expect( stubs.validatePackageName.getCall( 0 ).args[ 0 ].constructor.name ).to.equal( 'Logger' );
		expect( stubs.validatePackageName.getCall( 0 ).args[ 1 ] ).to.equal( '@scope/ckeditor5-feature' );
	} );

	it( 'passes undefined to validatePackageName() when the package name is not provided as the argument', async () => {
		process.argv = [ 'node', 'path/to/index.js' ];

		await require( '../lib/index' );

		expect( stubs.validatePackageName.callCount ).to.equal( 1 );
		expect( stubs.validatePackageName.getCall( 0 ).args[ 0 ].constructor.name ).to.equal( 'Logger' );
		expect( stubs.validatePackageName.getCall( 0 ).args[ 1 ] ).to.equal( undefined );
	} );

	it( 'creates logger in non-verbose mode by default', async () => {
		process.argv = [ 'node', 'path/to/index.js' ];

		await require( '../lib/index' );

		expect( stubs.validatePackageName.callCount ).to.equal( 1 );
		expect( stubs.validatePackageName.getCall( 0 ).args[ 0 ].constructor.name ).to.equal( 'Logger' );
		expect( stubs.validatePackageName.getCall( 0 ).args[ 0 ] ).to.deep.equal( { verbose: false, info: stubs.logger.info } );
	} );

	it( 'creates logger in verbose mode when using -v option', async () => {
		process.argv = [ 'node', 'path/to/index.js', '-v' ];

		await require( '../lib/index' );

		expect( stubs.validatePackageName.callCount ).to.equal( 1 );
		expect( stubs.validatePackageName.getCall( 0 ).args[ 0 ].constructor.name ).to.equal( 'Logger' );
		expect( stubs.validatePackageName.getCall( 0 ).args[ 0 ] ).to.deep.equal( { verbose: true, info: stubs.logger.info } );
	} );

	it( 'creates logger in verbose mode when using --verbose option', async () => {
		process.argv = [ 'node', 'path/to/index.js', '--verbose' ];

		await require( '../lib/index' );

		expect( stubs.validatePackageName.callCount ).to.equal( 1 );
		expect( stubs.validatePackageName.getCall( 0 ).args[ 0 ].constructor.name ).to.equal( 'Logger' );
		expect( stubs.validatePackageName.getCall( 0 ).args[ 0 ] ).to.deep.equal( { verbose: true, info: stubs.logger.info } );
	} );

	it( 'passes correct arguments to the createDirectory()', async () => {
		process.argv = [ 'node', 'path/to/index.js', '@scope/ckeditor5-feature' ];

		await require( '../lib/index' );

		expect( stubs.createDirectory.callCount ).to.equal( 1 );
		expect( stubs.createDirectory.getCall( 0 ).args[ 0 ].constructor.name ).to.equal( 'Logger' );
		expect( stubs.createDirectory.getCall( 0 ).args[ 1 ] ).to.equal( '@scope/ckeditor5-feature' );
	} );

	it( 'passes correct arguments to the getDependenciesVersions()', async () => {
		process.argv = [ 'node', 'path/to/index.js', '@scope/ckeditor5-feature' ];

		await require( '../lib/index' );

		expect( stubs.getDependenciesVersions.callCount ).to.equal( 1 );
		expect( stubs.getDependenciesVersions.getCall( 0 ).args[ 0 ].constructor.name ).to.equal( 'Logger' );
		expect( stubs.getDependenciesVersions.getCall( 0 ).args[ 1 ] ).to.deep.equal( { devMode: undefined } );
	} );

	it( 'uses dev mode when calling getDependenciesVersions() when using --dev', async () => {
		process.argv = [ 'node', 'path/to/index.js', '@scope/ckeditor5-feature', '--dev' ];

		await require( '../lib/index' );

		expect( stubs.getDependenciesVersions.callCount ).to.equal( 1 );
		expect( stubs.getDependenciesVersions.getCall( 0 ).args[ 0 ].constructor.name ).to.equal( 'Logger' );
		expect( stubs.getDependenciesVersions.getCall( 0 ).args[ 1 ] ).to.deep.equal( { devMode: true } );
	} );

	it( 'passes correct arguments to the getDllConfiguration()', async () => {
		process.argv = [ 'node', 'path/to/index.js', '@scope/ckeditor5-feature' ];

		await require( '../lib/index' );

		expect( stubs.getDllConfiguration.callCount ).to.equal( 1 );
		expect( stubs.getDllConfiguration.getCall( 0 ).args[ 0 ] ).to.equal( '@scope/ckeditor5-feature' );
	} );

	it( 'passes correct arguments to the copyFiles()', async () => {
		process.argv = [ 'node', 'path/to/index.js', '@scope/ckeditor5-feature' ];

		await require( '../lib/index' );

		expect( stubs.copyFiles.callCount ).to.equal( 1 );
		expect( stubs.copyFiles.getCall( 0 ).args[ 0 ].constructor.name ).to.equal( 'Logger' );
		expect( stubs.copyFiles.getCall( 0 ).args[ 1 ] ).to.deep.equal( {
			programmingLanguage: 'js',
			packageName: '@scope/ckeditor5-feature',
			program: 'yarn',
			directoryPath: 'directoryPath',
			packageVersions: {
				ckeditor5: '30.0.0'
			},
			dllConfiguration: {
				fileName: 'feature.js',
				library: 'feature'
			}
		} );
	} );

	it( 'passes correct program argument to the copyFiles() when using --use-npm', async () => {
		process.argv = [ 'node', 'path/to/index.js', '@scope/ckeditor5-feature', '--use-npm' ];

		await require( '../lib/index' );

		expect( stubs.copyFiles.callCount ).to.equal( 1 );
		expect( stubs.copyFiles.getCall( 0 ).args[ 0 ].constructor.name ).to.equal( 'Logger' );
		expect( stubs.copyFiles.getCall( 0 ).args[ 1 ] ).to.deep.equal( {
			programmingLanguage: 'js',
			packageName: '@scope/ckeditor5-feature',
			program: 'npm',
			directoryPath: 'directoryPath',
			packageVersions: {
				ckeditor5: '30.0.0'
			},
			dllConfiguration: {
				fileName: 'feature.js',
				library: 'feature'
			}
		} );
	} );

	it( 'passes correct arguments to the installDependencies()', async () => {
		process.argv = [ 'node', 'path/to/index.js', '@scope/ckeditor5-feature' ];

		await require( '../lib/index' );

		expect( stubs.installDependencies.callCount ).to.equal( 1 );
		expect( stubs.installDependencies.getCall( 0 ).args[ 0 ] ).to.equal( 'directoryPath' );
		expect( stubs.installDependencies.getCall( 0 ).args[ 1 ] ).to.deep.equal( {
			useNpm: false,
			verbose: false
		} );
	} );

	// TODO: fix
	// For whatever reason, nothing after installDependencies() registers the call, despite the code executing.

	// it( 'passes correct arguments to the initializeGitRepository()', async () => {
	// 	process.argv = [ 'node', 'path/to/index.js', '@scope/ckeditor5-feature' ];

	// 	await require( '../lib/index' );

	// 	expect( stubs.initializeGitRepository.callCount ).to.equal( 1 );
	// 	expect( stubs.initializeGitRepository.getCall( 0 ).args[ 0 ] ).to.equal( 'directoryPath' );
	// 	expect( stubs.initializeGitRepository.getCall( 0 ).args[ 1 ].constructor.name ).to.equal( 'Logger' );
	// } );

	// it( 'passes correct arguments to the installGitHooks()', async () => {
	// 	process.argv = [ 'node', 'path/to/index.js', '@scope/ckeditor5-feature' ];

	// 	await require( '../lib/index' );

	// 	expect( stubs.installGitHooks.callCount ).to.equal( 1 );
	// 	expect( stubs.installGitHooks.getCall( 0 ).args[ 0 ] ).to.equal( 'directoryPath' );
	// 	expect( stubs.installGitHooks.getCall( 0 ).args[ 1 ].constructor.name ).to.equal( 'Logger' );
	// 	expect( stubs.installGitHooks.getCall( 0 ).args[ 2 ] ).to.deep.equal( {
	// 		useNpm: false,
	// 		verbose: false
	// 	} );
	// } );

	// it( 'logs info when the script finishes', async () => {
	// 	process.argv = [ 'node', 'path/to/index.js', '@scope/ckeditor5-feature' ];

	// 	await require( '../lib/index' );

	// 	expect( stubs.logger.info.callCount ).to.equal( 1 );
	// 	expect( stubs.logger.info.getCall( 0 ).args[ 0 ].split( '\n' ) ).to.equal( [
	// 		'Done!',
	// 		'',
	// 		'Execute the "cd ckeditor5-feature" command to change the current working directory',
	// 		'to the newly created package. Then, the package offers a few predefined scripts:',
	// 		'',
	// 		'  * start - for creating the HTTP server with the editor sample,',
	// 		'  * test - for executing unit tests of an example plugin,',
	// 		'  * lint - for running a tool for static analyzing JavaScript files,',
	// 		'  * stylelint - for running a tool for static analyzing CSS files.',
	// 		'',
	// 		'Example: yarn run start',
	// 		''
	// 	] );
	// 	expect( stubs.logger.info.getCall( 0 ).args[ 1 ] ).to.deep.equal( { startWithNewLine: true } );
	// } );
} );

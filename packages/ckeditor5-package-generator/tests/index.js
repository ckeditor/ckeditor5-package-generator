/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

const mockery = require( 'mockery' );
const sinon = require( 'sinon' );
const { expect } = require( 'chai' );

describe( 'lib/index', () => {
	let options, stubs, index;

	const packageName = '@scope/ckeditor5-feature';

	beforeEach( () => {
		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

		options = {
			verbose: false,
			useYarn: false,
			useNpm: false,
			name: 'FooBar',
			lang: 'js',
			dev: false
		};

		stubs = {
			chalk: {
				underline: sinon.stub().callsFake( str => str ),
				green: sinon.stub().callsFake( str => str ),
				cyan: sinon.stub().callsFake( str => str ),
				gray: sinon.stub().callsFake( str => str )
			},
			logger: {
				info: sinon.stub()
			},
			choosePackageManager: sinon.stub(),
			chooseProgrammingLanguage: sinon.stub(),
			copyFiles: sinon.stub(),
			createDirectory: sinon.stub(),
			getDependenciesVersions: sinon.stub(),
			getPackageName: sinon.stub(),
			initializeGitRepository: sinon.stub(),
			installDependencies: sinon.stub(),
			installGitHooks: sinon.stub(),
			validateClassName: sinon.stub(),
			validatePackageName: sinon.stub()
		};

		stubs.getPackageName.returns( {
			fullScoped: '@foo/ckeditor5-bar-baz',
			pascalCase: 'BarBaz',
			camelCase: 'barBaz',
			kebabCase: 'bar-baz',
			lowerCase: 'barbaz',
			spacedOut: 'Bar baz'
		} );
		stubs.createDirectory.returns( {
			directoryName: 'directoryName',
			directoryPath: 'directoryPath'
		} );
		stubs.choosePackageManager.resolves( 'yarn' );
		stubs.chooseProgrammingLanguage.resolves( 'js' );
		stubs.getDependenciesVersions.returns( {
			ckeditor5: '30.0.0'
		} );
		stubs.installDependencies.resolves();
		stubs.initializeGitRepository.returns();
		stubs.installGitHooks.resolves();

		class Logger {
			constructor( verbose ) {
				this.verbose = verbose;
				this.info = stubs.logger.info;
			}
		}

		mockery.registerMock( 'chalk', stubs.chalk );
		mockery.registerMock( './utils/logger', Logger );

		mockery.registerMock( './utils/choose-package-manager', stubs.choosePackageManager );
		mockery.registerMock( './utils/choose-programming-language', stubs.chooseProgrammingLanguage );
		mockery.registerMock( './utils/copy-files', stubs.copyFiles );
		mockery.registerMock( './utils/create-directory', stubs.createDirectory );
		mockery.registerMock( './utils/get-dependencies-versions', stubs.getDependenciesVersions );
		mockery.registerMock( './utils/get-package-name', stubs.getPackageName );
		mockery.registerMock( './utils/initialize-git-repository', stubs.initializeGitRepository );
		mockery.registerMock( './utils/install-dependencies', stubs.installDependencies );
		mockery.registerMock( './utils/install-git-hooks', stubs.installGitHooks );
		mockery.registerMock( './utils/validate-class-name', stubs.validateClassName );
		mockery.registerMock( './utils/validate-package-name', stubs.validatePackageName );

		index = require( '../lib/index' );
	} );

	afterEach( () => {
		mockery.deregisterAll();
		mockery.disable();
		sinon.restore();
	} );

	it( 'should be a function', () => {
		expect( index ).to.be.a( 'function' );
	} );

	it( 'creates logger with verbose option set to false', async () => {
		await index( packageName, options );

		expect( stubs.validatePackageName.callCount ).to.equal( 1 );
		expect( stubs.validatePackageName.getCall( 0 ).args[ 0 ].constructor.name ).to.equal( 'Logger' );
		expect( stubs.validatePackageName.getCall( 0 ).args[ 0 ] ).to.deep.equal( { verbose: false, info: stubs.logger.info } );
	} );

	it( 'creates logger with verbose option set to true', async () => {
		options.verbose = true;

		await index( packageName, options );

		expect( stubs.validatePackageName.callCount ).to.equal( 1 );
		expect( stubs.validatePackageName.getCall( 0 ).args[ 0 ].constructor.name ).to.equal( 'Logger' );
		expect( stubs.validatePackageName.getCall( 0 ).args[ 0 ] ).to.deep.equal( { verbose: true, info: stubs.logger.info } );
	} );

	it( 'passes correct arguments to the validatePackageName()', async () => {
		await index( packageName, options );

		expect( stubs.validatePackageName.callCount ).to.equal( 1 );
		expect( stubs.validatePackageName.getCall( 0 ).args.length ).to.equal( 2 );

		expect( stubs.validatePackageName.getCall( 0 ).args[ 0 ].constructor.name ).to.equal( 'Logger' );
		expect( stubs.validatePackageName.getCall( 0 ).args[ 1 ] ).to.equal( '@scope/ckeditor5-feature' );
	} );

	it( 'passes correct arguments to the validateClassName()', async () => {
		await index( packageName, options );

		expect( stubs.validateClassName.callCount ).to.equal( 1 );
		expect( stubs.validateClassName.getCall( 0 ).args.length ).to.equal( 2 );

		expect( stubs.validateClassName.getCall( 0 ).args[ 0 ].constructor.name ).to.equal( 'Logger' );
		expect( stubs.validateClassName.getCall( 0 ).args[ 1 ] ).to.deep.equal( options );
	} );

	it( 'passes correct arguments to the getPackageName()', async () => {
		await index( packageName, options );

		expect( stubs.getPackageName.callCount ).to.equal( 1 );
		expect( stubs.getPackageName.getCall( 0 ).args.length ).to.equal( 2 );

		expect( stubs.getPackageName.getCall( 0 ).args[ 0 ] ).to.equal( '@scope/ckeditor5-feature' );
		expect( stubs.getPackageName.getCall( 0 ).args[ 1 ] ).to.deep.equal( options );
	} );

	it( 'passes correct arguments to the createDirectory()', async () => {
		await index( packageName, options );

		expect( stubs.createDirectory.callCount ).to.equal( 1 );
		expect( stubs.createDirectory.getCall( 0 ).args.length ).to.equal( 2 );

		expect( stubs.createDirectory.getCall( 0 ).args[ 0 ].constructor.name ).to.equal( 'Logger' );
		expect( stubs.createDirectory.getCall( 0 ).args[ 1 ] ).to.equal( '@scope/ckeditor5-feature' );
	} );

	it( 'passes correct arguments to the choosePackageManager()', async () => {
		await index( packageName, options );

		expect( stubs.choosePackageManager.callCount ).to.equal( 1 );
		expect( stubs.choosePackageManager.getCall( 0 ).args.length ).to.equal( 1 );

		expect( stubs.choosePackageManager.getCall( 0 ).args[ 0 ] ).to.deep.equal( options );
	} );

	it( 'passes correct arguments to the chooseProgrammingLanguage()', async () => {
		await index( packageName, options );

		expect( stubs.chooseProgrammingLanguage.callCount ).to.equal( 1 );
		expect( stubs.chooseProgrammingLanguage.getCall( 0 ).args.length ).to.equal( 2 );

		expect( stubs.chooseProgrammingLanguage.getCall( 0 ).args[ 0 ].constructor.name ).to.equal( 'Logger' );
		expect( stubs.chooseProgrammingLanguage.getCall( 0 ).args[ 1 ] ).to.deep.equal( options );
	} );

	it( 'passes correct arguments to the getDependenciesVersions()', async () => {
		await index( packageName, options );

		expect( stubs.getDependenciesVersions.callCount ).to.equal( 1 );
		expect( stubs.getDependenciesVersions.getCall( 0 ).args.length ).to.equal( 2 );

		expect( stubs.getDependenciesVersions.getCall( 0 ).args[ 0 ].constructor.name ).to.equal( 'Logger' );
		expect( stubs.getDependenciesVersions.getCall( 0 ).args[ 1 ] ).to.deep.equal( options );
	} );

	it( 'passes correct arguments to the copyFiles()', async () => {
		await index( packageName, options );

		expect( stubs.copyFiles.callCount ).to.equal( 1 );
		expect( stubs.copyFiles.getCall( 0 ).args.length ).to.equal( 2 );

		expect( stubs.copyFiles.getCall( 0 ).args[ 0 ].constructor.name ).to.equal( 'Logger' );
		expect( stubs.copyFiles.getCall( 0 ).args[ 1 ] ).to.deep.equal( {
			programmingLanguage: 'js',
			packageName: {
				fullScoped: '@foo/ckeditor5-bar-baz',
				pascalCase: 'BarBaz',
				camelCase: 'barBaz',
				kebabCase: 'bar-baz',
				lowerCase: 'barbaz',
				spacedOut: 'Bar baz'
			},
			packageManager: 'yarn',
			directoryPath: 'directoryPath',
			packageVersions: {
				ckeditor5: '30.0.0'
			}
		} );
	} );

	it( 'passes correct arguments to the installDependencies()', async () => {
		await index( packageName, options );

		expect( stubs.installDependencies.callCount ).to.equal( 1 );
		expect( stubs.installDependencies.getCall( 0 ).args.length ).to.equal( 3 );

		expect( stubs.installDependencies.getCall( 0 ).args[ 0 ] ).to.equal( 'directoryPath' );
		expect( stubs.installDependencies.getCall( 0 ).args[ 1 ] ).to.equal( 'yarn' );
		expect( stubs.installDependencies.getCall( 0 ).args[ 2 ] ).to.deep.equal( options );
	} );

	it( 'passes correct arguments to the initializeGitRepository()', async () => {
		await index( packageName, options );

		expect( stubs.initializeGitRepository.callCount ).to.equal( 1 );
		expect( stubs.initializeGitRepository.getCall( 0 ).args.length ).to.equal( 2 );

		expect( stubs.initializeGitRepository.getCall( 0 ).args[ 0 ] ).to.equal( 'directoryPath' );
		expect( stubs.initializeGitRepository.getCall( 0 ).args[ 1 ].constructor.name ).to.equal( 'Logger' );
	} );

	it( 'passes correct arguments to the installGitHooks()', async () => {
		await index( packageName, options );

		expect( stubs.installGitHooks.callCount ).to.equal( 1 );
		expect( stubs.installGitHooks.getCall( 0 ).args.length ).to.equal( 3 );

		expect( stubs.installGitHooks.getCall( 0 ).args[ 0 ] ).to.equal( 'directoryPath' );
		expect( stubs.installGitHooks.getCall( 0 ).args[ 1 ].constructor.name ).to.equal( 'Logger' );
		expect( stubs.installGitHooks.getCall( 0 ).args[ 2 ] ).to.deep.equal( options );
	} );

	it( 'logs info when the script finishes', async () => {
		await index( packageName, options );

		expect( stubs.logger.info.callCount ).to.equal( 1 );
		expect( stubs.logger.info.getCall( 0 ).args[ 0 ] ).to.equal( [
			'Done!',
			'',
			'Execute the "cd directoryName" command to change the current working directory',
			'to the newly created package. Then, the package offers a few predefined scripts:',
			'',
			'  * start - for creating the HTTP server with the editor sample,',
			'  * test - for executing unit tests of an example plugin,',
			'  * lint - for running a tool for static analyzing JavaScript files,',
			'  * stylelint - for running a tool for static analyzing CSS files.',
			'',
			'Example: yarn run start',
			''
		].join( '\n' ) );
		expect( stubs.logger.info.getCall( 0 ).args[ 1 ] ).to.deep.equal( { startWithNewLine: true } );
	} );
} );

/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
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
			verbose: true,
			useYarn: true,
			useNpm: false,
			installationMethods: 'current',
			pluginName: 'FooBar',
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
			chooseInstallationMethods: sinon.stub(),
			copyFiles: sinon.stub(),
			createDirectory: sinon.stub(),
			getDependenciesVersions: sinon.stub(),
			getPackageNameFormats: sinon.stub(),
			initializeGitRepository: sinon.stub(),
			installDependencies: sinon.stub(),
			installGitHooks: sinon.stub(),
			validatePluginName: sinon.stub(),
			validatePackageName: sinon.stub()
		};

		stubs.getPackageNameFormats.returns( {
			package: {
				raw: 'xyz',
				spacedOut: 'Xyz',
				camelCase: 'xyz',
				pascalCase: 'Xyz',
				lowerCaseMerged: 'xyz'
			},
			plugin: {
				raw: 'BarBaz',
				spacedOut: 'Bar baz',
				camelCase: 'barBaz',
				pascalCase: 'BarBaz',
				lowerCaseMerged: 'barbaz'
			}
		} );
		stubs.createDirectory.returns( {
			directoryName: 'directoryName',
			directoryPath: 'directoryPath'
		} );
		stubs.choosePackageManager.resolves( 'yarn' );
		stubs.chooseProgrammingLanguage.resolves( 'js' );
		stubs.chooseInstallationMethods.resolves( 'current' );
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
		mockery.registerMock( './utils/choose-installation-methods', stubs.chooseInstallationMethods );
		mockery.registerMock( './utils/copy-files', stubs.copyFiles );
		mockery.registerMock( './utils/create-directory', stubs.createDirectory );
		mockery.registerMock( './utils/get-dependencies-versions', stubs.getDependenciesVersions );
		mockery.registerMock( './utils/get-package-name-formats', stubs.getPackageNameFormats );
		mockery.registerMock( './utils/initialize-git-repository', stubs.initializeGitRepository );
		mockery.registerMock( './utils/install-dependencies', stubs.installDependencies );
		mockery.registerMock( './utils/install-git-hooks', stubs.installGitHooks );
		mockery.registerMock( './utils/validate-package-name', stubs.validatePackageName );
		mockery.registerMock( './utils/validate-plugin-name', stubs.validatePluginName );

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

	it( 'passes the verbose option when creating the logger ("true" check)', async () => {
		await index( packageName, options );

		const logger = stubs.validatePackageName.getCall( 0 ).args[ 0 ];
		expect( logger.constructor.name ).to.equal( 'Logger' );
		expect( logger ).to.deep.equal( { verbose: true, info: stubs.logger.info } );
	} );

	it( 'passes the verbose option when creating the logger ("false" check)', async () => {
		options.verbose = false;

		await index( packageName, options );

		const logger = stubs.validatePackageName.getCall( 0 ).args[ 0 ];
		expect( logger.constructor.name ).to.equal( 'Logger' );
		expect( logger ).to.deep.equal( { verbose: false, info: stubs.logger.info } );
	} );

	it( 'validates the package name', async () => {
		await index( packageName, options );

		expect( stubs.validatePackageName.callCount ).to.equal( 1 );
		expect( stubs.validatePackageName.getCall( 0 ).args.length ).to.equal( 2 );

		expect( stubs.validatePackageName.getCall( 0 ).args[ 0 ].constructor.name ).to.equal( 'Logger' );
		expect( stubs.validatePackageName.getCall( 0 ).args[ 1 ] ).to.equal( '@scope/ckeditor5-feature' );
	} );

	it( 'validates the plugin name', async () => {
		await index( packageName, options );

		expect( stubs.validatePluginName.callCount ).to.equal( 1 );
		expect( stubs.validatePluginName.getCall( 0 ).args.length ).to.equal( 2 );

		expect( stubs.validatePluginName.getCall( 0 ).args[ 0 ].constructor.name ).to.equal( 'Logger' );
		expect( stubs.validatePluginName.getCall( 0 ).args[ 1 ] ).to.equal( 'FooBar' );
	} );

	it( 'gets the package name formats', async () => {
		await index( packageName, options );

		expect( stubs.getPackageNameFormats.callCount ).to.equal( 1 );
		expect( stubs.getPackageNameFormats.getCall( 0 ).args.length ).to.equal( 2 );

		expect( stubs.getPackageNameFormats.getCall( 0 ).args[ 0 ] ).to.equal( '@scope/ckeditor5-feature' );
		expect( stubs.getPackageNameFormats.getCall( 0 ).args[ 1 ] ).to.equal( 'FooBar' );
	} );

	it( 'creates the directory', async () => {
		await index( packageName, options );

		expect( stubs.createDirectory.callCount ).to.equal( 1 );
		expect( stubs.createDirectory.getCall( 0 ).args.length ).to.equal( 2 );

		expect( stubs.createDirectory.getCall( 0 ).args[ 0 ].constructor.name ).to.equal( 'Logger' );
		expect( stubs.createDirectory.getCall( 0 ).args[ 1 ] ).to.equal( '@scope/ckeditor5-feature' );
	} );

	it( 'chooses the package manager', async () => {
		await index( packageName, options );

		expect( stubs.choosePackageManager.callCount ).to.equal( 1 );
		expect( stubs.choosePackageManager.getCall( 0 ).args.length ).to.equal( 2 );

		expect( stubs.choosePackageManager.getCall( 0 ).args[ 0 ] ).to.equal( false );
		expect( stubs.choosePackageManager.getCall( 0 ).args[ 1 ] ).to.equal( true );
	} );

	it( 'chooses the programming language', async () => {
		await index( packageName, options );

		expect( stubs.chooseProgrammingLanguage.callCount ).to.equal( 1 );
		expect( stubs.chooseProgrammingLanguage.getCall( 0 ).args.length ).to.equal( 2 );

		expect( stubs.chooseProgrammingLanguage.getCall( 0 ).args[ 0 ].constructor.name ).to.equal( 'Logger' );
		expect( stubs.chooseProgrammingLanguage.getCall( 0 ).args[ 1 ] ).to.equal( 'js' );
	} );

	it( 'chooses the installation method', async () => {
		await index( packageName, options );

		expect( stubs.chooseInstallationMethods.callCount ).to.equal( 1 );
		expect( stubs.chooseInstallationMethods.getCall( 0 ).args.length ).to.equal( 2 );

		expect( stubs.chooseInstallationMethods.getCall( 0 ).args[ 0 ].constructor.name ).to.equal( 'Logger' );
		expect( stubs.chooseInstallationMethods.getCall( 0 ).args[ 1 ] ).to.equal( 'current' );
	} );

	it( 'gets the versions of the dependencies', async () => {
		await index( packageName, options );

		expect( stubs.getDependenciesVersions.callCount ).to.equal( 1 );
		expect( stubs.getDependenciesVersions.getCall( 0 ).args.length ).to.equal( 2 );

		expect( stubs.getDependenciesVersions.getCall( 0 ).args[ 0 ].constructor.name ).to.equal( 'Logger' );
		expect( stubs.getDependenciesVersions.getCall( 0 ).args[ 1 ] ).to.equal( false );
	} );

	it( 'copies the files', async () => {
		await index( packageName, options );

		expect( stubs.copyFiles.callCount ).to.equal( 1 );
		expect( stubs.copyFiles.getCall( 0 ).args.length ).to.equal( 2 );

		expect( stubs.copyFiles.getCall( 0 ).args[ 0 ].constructor.name ).to.equal( 'Logger' );
		expect( stubs.copyFiles.getCall( 0 ).args[ 1 ] ).to.deep.equal( {
			packageName: '@scope/ckeditor5-feature',
			programmingLanguage: 'js',
			installationMethodOfPackage: 'current',
			formattedNames: {
				package: {
					raw: 'xyz',
					spacedOut: 'Xyz',
					camelCase: 'xyz',
					pascalCase: 'Xyz',
					lowerCaseMerged: 'xyz'
				},
				plugin: {
					raw: 'BarBaz',
					spacedOut: 'Bar baz',
					camelCase: 'barBaz',
					pascalCase: 'BarBaz',
					lowerCaseMerged: 'barbaz'
				}
			},
			packageManager: 'yarn',
			directoryPath: 'directoryPath',
			packageVersions: {
				ckeditor5: '30.0.0'
			}
		} );
	} );

	it( 'installs the dependencies', async () => {
		await index( packageName, options );

		expect( stubs.installDependencies.callCount ).to.equal( 1 );
		expect( stubs.installDependencies.getCall( 0 ).args.length ).to.equal( 4 );

		expect( stubs.installDependencies.getCall( 0 ).args[ 0 ] ).to.equal( 'directoryPath' );
		expect( stubs.installDependencies.getCall( 0 ).args[ 1 ] ).to.equal( 'yarn' );
		expect( stubs.installDependencies.getCall( 0 ).args[ 2 ] ).to.equal( true );
		expect( stubs.installDependencies.getCall( 0 ).args[ 3 ] ).to.equal( false );
	} );

	it( 'initializes the git repository', async () => {
		await index( packageName, options );

		expect( stubs.initializeGitRepository.callCount ).to.equal( 1 );
		expect( stubs.initializeGitRepository.getCall( 0 ).args.length ).to.equal( 2 );

		expect( stubs.initializeGitRepository.getCall( 0 ).args[ 0 ] ).to.equal( 'directoryPath' );
		expect( stubs.initializeGitRepository.getCall( 0 ).args[ 1 ].constructor.name ).to.equal( 'Logger' );
	} );

	it( 'installs the git hooks', async () => {
		await index( packageName, options );

		expect( stubs.installGitHooks.callCount ).to.equal( 1 );
		expect( stubs.installGitHooks.getCall( 0 ).args.length ).to.equal( 3 );

		expect( stubs.installGitHooks.getCall( 0 ).args[ 0 ] ).to.equal( 'directoryPath' );
		expect( stubs.installGitHooks.getCall( 0 ).args[ 1 ].constructor.name ).to.equal( 'Logger' );
		expect( stubs.installGitHooks.getCall( 0 ).args[ 2 ] ).to.equal( true );
	} );

	it( 'logs info before the script finishes', async () => {
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

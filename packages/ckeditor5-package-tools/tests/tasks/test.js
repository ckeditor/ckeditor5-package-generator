/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

const sinon = require( 'sinon' );
const expect = require( 'chai' ).expect;
const mockery = require( 'mockery' );

describe( 'lib/tasks/test', () => {
	let testTask, stubs, karmaServerArguments;

	beforeEach( () => {
		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

		stubs = {
			generateEntryFile: sinon.stub(),
			getKarmaConfig: sinon.stub(),
			karma: {
				Server: class KarmaServer {
					constructor( ...args ) {
						karmaServerArguments = args;
					}

					on( ...args ) {
						return stubs.karma.karmaServerOn( ...args );
					}

					start( ...args ) {
						return stubs.karma.karmaServerOn( ...args );
					}
				},
				karmaServerOn: sinon.stub(),
				karmaServerStart: sinon.stub()
			},
			fs: {
				writeFileSync: sinon.stub(),
				utimesSync: sinon.stub()
			},
			path: {
				join: sinon.stub().callsFake( ( ...chunks ) => chunks.join( '/' ) ),
				sep: sinon.stub().returns( '/' )
			}
		};

		mockery.registerMock( '../utils/generate-entry-file', stubs.generateEntryFile );
		mockery.registerMock( '../utils/get-karma-config', stubs.getKarmaConfig );
		mockery.registerMock( 'karma', stubs.karma );
		mockery.registerMock( 'fs', stubs.fs );
		mockery.registerMock( 'path', stubs.path );

		testTask = require( '../../lib/tasks/test' );
	} );

	afterEach( () => {
		sinon.restore();
		mockery.disable();
	} );

	it( 'should be a function', () => {
		expect( testTask ).to.be.a( 'function' );
	} );

	it( 'should add a path to the test entry file to the "options" object', () => {
		const options = {
			cwd: '/cwd'
		};

		testTask( options );

		expect( options ).to.deep.equal( {
			cwd: '/cwd',
			entryFile: '/cwd/tmp/tests-entry-point.js'
		} );
	} );

	it( 'should create the test entry file', () => {
		const options = {
			cwd: '/cwd'
		};

		testTask( options );

		expect( stubs.generateEntryFile.calledOnce ).to.equal( true );
		expect( stubs.generateEntryFile.firstCall.args[ 0 ] ).to.equal( '/cwd/tmp/tests-entry-point.js' );
	} );

	it( 'should run karma with the proper configuration and return a promise', done => {
		const options = {
			cwd: '/cwd'
		};

		const karmaConfig = {
			basePath: '/cwd'
		};

		stubs.getKarmaConfig.returns( karmaConfig );

		setTimeout( () => {
			// Call the karma callback when finished executing tests.
			// The callback requires an exit code. 0 means finished without errors.
			karmaServerArguments[ 1 ]( 0 );
		} );

		testTask( options )
			.then( () => {
				expect( karmaServerArguments[ 0 ] ).to.deep.equal( karmaConfig );

				done();
			} );
	} );

	it( 'should reject a promise when karma finished with non-zero exit code', done => {
		const options = {
			cwd: '/cwd'
		};

		const karmaConfig = {
			basePath: '/cwd'
		};

		stubs.getKarmaConfig.returns( karmaConfig );

		setTimeout( () => {
			// Call the karma callback when finished executing tests.
			// The callback requires an exit code. Non-zero exit code means that something went wrong.
			karmaServerArguments[ 1 ]( 1 );
		} );

		testTask( options )
			.then(
				() => {
					throw new Error( 'Expected to be rejected.' );
				},
				err => {
					expect( err.message ).to.equal( 'Karma finished with "1" code.' );

					done();
				}
			);
	} );

	it( 'should display a path to the "coverage/" directory if the coverage option is set to true', done => {
		const options = {
			cwd: '/cwd',
			coverage: true
		};

		const karmaConfig = {
			basePath: '/cwd'
		};

		stubs.getKarmaConfig.returns( karmaConfig );

		setTimeout( () => {
			// Call the karma callback when finished executing tests.
			// The callback requires an exit code. 0 means finished without errors.
			karmaServerArguments[ 1 ]( 0 );
		} );

		sinon.stub( console, 'info' );

		testTask( options )
			.then( () => {
				expect( stubs.karma.karmaServerOn.firstCall ).to.not.be.undefined;

				// Verify listening to the "run_complete" event emitted when karma finished executing tests.
				expect( stubs.karma.karmaServerOn.firstCall.args[ 0 ] ).to.equal( 'run_complete' );

				// Mock emitting the event.
				stubs.karma.karmaServerOn.firstCall.args[ 1 ].call();

				// `setTimeout` is required because the "run_complete" callback also executes the same function.
				setTimeout( () => {
					expect( console.info.calledOnce ).to.equal( true );
					expect( console.info.firstCall.args[ 0 ].startsWith( 'Coverage report saved in ' ) ).to.equal( true );
					done();
				} );
			} );
	} );
} );

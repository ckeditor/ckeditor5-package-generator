/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const sinon = require( 'sinon' );
const expect = require( 'chai' ).expect;
const mockery = require( 'mockery' );

describe( 'lib/tasks/dll-build', () => {
	let dllBuild, stubs;

	beforeEach( () => {
		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

		stubs = {
			webpack: sinon.stub(),
			webpackConfig: sinon.stub()
		};

		mockery.registerMock( 'webpack', stubs.webpack );
		mockery.registerMock( '../utils/get-webpack-config-dll', stubs.webpackConfig );

		dllBuild = require( '../../lib/tasks/dll-build' );
	} );

	afterEach( () => {
		sinon.restore();
		mockery.disable();
	} );

	it( 'should be a function', () => {
		expect( dllBuild ).to.be.a( 'function' );
	} );

	it( 'resolves a promise after building a file', done => {
		const taskOptions = {
			cwd: '/cwd'
		};

		const webpackConfig = {
			mode: 'production',
			entry: 'index.js'
		};

		// Mock reading the configuration.
		stubs.webpackConfig.returns( webpackConfig );

		const consoleStub = sinon.stub( console, 'log' );

		// Execute the task.
		dllBuild( taskOptions )
			.then( () => {
				consoleStub.restore();

				expect( consoleStub.calledOnce ).to.equal( true );
				expect( consoleStub.firstCall.args[ 0 ] ).to.equal( 'Compilation stats.' );

				done();
			} );

		expect( stubs.webpack.calledOnce ).to.equal( true );
		expect( stubs.webpack.firstCall.args[ 0 ] ).to.equal( webpackConfig );
		expect( stubs.webpack.firstCall.args[ 1 ] ).to.be.a( 'function' );

		const doneCallback = stubs.webpack.firstCall.args[ 1 ];
		doneCallback( null, {
			hasErrors() {
				return false;
			},
			toString() {
				return 'Compilation stats.';
			}
		} );
	} );

	it( 'rejects if webpack returned an error', done => {
		const taskOptions = {
			cwd: '/cwd'
		};

		const error = new Error( 'Unexpected error.' );

		// Mock reading the configuration.
		stubs.webpackConfig.returns( {} );

		// Execute the task.
		dllBuild( taskOptions )
			.then(
				() => {
					throw new Error( 'Expected to be rejected.' );
				},
				err => {
					expect( err ).to.equal( error );
					done();
				}
			);

		expect( stubs.webpack.calledOnce ).to.equal( true );

		const doneCallback = stubs.webpack.firstCall.args[ 1 ];

		doneCallback( error, {} );
	} );

	it( 'rejects if webpack completed a build with an error', done => {
		const taskOptions = {
			cwd: '/cwd'
		};

		// Mock reading the configuration.
		stubs.webpackConfig.returns( {} );

		// Execute the task.
		dllBuild( taskOptions )
			.then(
				() => {
					throw new Error( 'Expected to be rejected.' );
				},
				err => {
					expect( err.message ).to.equal( 'Unexpected error.' );
					done();
				}
			);

		expect( stubs.webpack.calledOnce ).to.equal( true );

		const doneCallback = stubs.webpack.firstCall.args[ 1 ];

		doneCallback( null, {
			hasErrors() {
				return true;
			},
			toString() {
				return 'Unexpected error.';
			}
		} );
	} );
} );

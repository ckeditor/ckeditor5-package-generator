/**
 * @license Copyright (c) 2020-2022, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const sinon = require( 'sinon' );
const expect = require( 'chai' ).expect;
const mockery = require( 'mockery' );

describe( 'lib/index', () => {
	let tasks, sandbox, stubs;

	beforeEach( () => {
		sandbox = sinon.createSandbox();

		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

		stubs = {
			tasks: {
				start: sinon.stub(),
				test: sinon.stub(),
				dllBuild: sinon.stub(),
				translationsCollect: sinon.stub(),
				translationsDownload: sinon.stub(),
				translationsUpload: sinon.stub()
			}
		};

		mockery.registerMock( '../lib/tasks/test', stubs.tasks.test );
		mockery.registerMock( '../lib/tasks/start', stubs.tasks.start );
		mockery.registerMock( '../lib/tasks/dll-build', stubs.tasks.dllBuild );
		mockery.registerMock( '../lib/tasks/translations-collect', stubs.tasks.translationsCollect );
		mockery.registerMock( '../lib/tasks/translations-download', stubs.tasks.translationsDownload );
		mockery.registerMock( '../lib/tasks/translations-upload', stubs.tasks.translationsUpload );

		tasks = require( '../lib' );
	} );

	afterEach( () => {
		sandbox.restore();
		mockery.disable();
	} );

	it( 'should be an object containing available tasks', () => {
		expect( tasks ).to.be.an( 'object' );
	} );

	describe( '#start', () => {
		it( 'is available', () => {
			expect( tasks.start ).is.a( 'function' );
		} );

		it( 'executes the proper function from the "tasks/" directory', () => {
			tasks.start();

			expect( stubs.tasks.start.calledOnce ).to.equal( true );
		} );

		it( 'passes arguments directly to the function', () => {
			const options = { foo: 1, bar: true };
			tasks.start( options );

			expect( stubs.tasks.start.firstCall.args[ 0 ] ).to.deep.equal( options );
		} );
	} );

	describe( '#test', () => {
		it( 'is available', () => {
			expect( tasks.test ).is.a( 'function' );
		} );

		it( 'executes the proper function from the "tasks/" directory', () => {
			tasks.test();

			expect( stubs.tasks.test.calledOnce ).to.equal( true );
		} );

		it( 'passes arguments directly to the function', () => {
			const options = { foo: 1, bar: true };
			tasks.test( options );

			expect( stubs.tasks.test.firstCall.args[ 0 ] ).to.deep.equal( options );
		} );
	} );

	describe( '#dll:build', () => {
		it( 'is available', () => {
			expect( tasks[ 'dll:build' ] ).is.a( 'function' );
		} );

		it( 'executes the proper function from the "tasks/" directory', () => {
			tasks[ 'dll:build' ]();

			expect( stubs.tasks.dllBuild.calledOnce ).to.equal( true );
		} );

		it( 'passes arguments directly to the function', () => {
			const options = { foo: 1, bar: true };
			tasks[ 'dll:build' ]( options );

			expect( stubs.tasks.dllBuild.firstCall.args[ 0 ] ).to.deep.equal( options );
		} );
	} );

	describe( '#translations:collect', () => {
		it( 'is available', () => {
			expect( tasks[ 'translations:collect' ] ).is.a( 'function' );
		} );

		it( 'executes the proper function from the "tasks/" directory', () => {
			tasks[ 'translations:collect' ]();

			expect( stubs.tasks.translationsCollect.calledOnce ).to.equal( true );
		} );

		it( 'passes arguments directly to the function', () => {
			const options = { foo: 1, bar: true };
			tasks[ 'translations:collect' ]( options );

			expect( stubs.tasks.translationsCollect.firstCall.args[ 0 ] ).to.deep.equal( options );
		} );
	} );

	describe( '#translations:download', () => {
		it( 'is available', () => {
			expect( tasks[ 'translations:download' ] ).is.a( 'function' );
		} );

		it( 'executes the proper function from the "tasks/" directory', () => {
			tasks[ 'translations:download' ]();

			expect( stubs.tasks.translationsDownload.calledOnce ).to.equal( true );
		} );

		it( 'passes arguments directly to the function', () => {
			const options = { foo: 1, bar: true };
			tasks[ 'translations:download' ]( options );

			expect( stubs.tasks.translationsDownload.firstCall.args[ 0 ] ).to.deep.equal( options );
		} );
	} );

	describe( '#translations:upload', () => {
		it( 'is available', () => {
			expect( tasks[ 'translations:upload' ] ).is.a( 'function' );
		} );

		it( 'executes the proper function from the "tasks/" directory', () => {
			tasks[ 'translations:upload' ]();

			expect( stubs.tasks.translationsUpload.calledOnce ).to.equal( true );
		} );

		it( 'passes arguments directly to the function', () => {
			const options = { foo: 1, bar: true };
			tasks[ 'translations:upload' ]( options );

			expect( stubs.tasks.translationsUpload.firstCall.args[ 0 ] ).to.deep.equal( options );
		} );
	} );
} );

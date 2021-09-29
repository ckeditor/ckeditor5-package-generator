/**
 * @license Copyright (c) 2020-2021, CKSource - Frederico Knabben. All rights reserved.
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
				test: sinon.stub()
			}
		};

		mockery.registerMock( '../lib/tasks/test', stubs.tasks.test );
		mockery.registerMock( '../lib/tasks/start', stubs.tasks.start );

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
} );

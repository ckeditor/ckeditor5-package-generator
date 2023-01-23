/**
 * @license Copyright (c) 2020-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

const mockery = require( 'mockery' );
const sinon = require( 'sinon' );
const { expect } = require( 'chai' );

describe( 'lib/tasks/export-package-as-typescript', () => {
	let stubs, exportPackageAsTypescript;

	beforeEach( () => {
		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

		stubs = {
			updateEntryPoint: sinon.stub()
		};

		mockery.registerMock( '../utils/update-entry-point', stubs.updateEntryPoint );

		exportPackageAsTypescript = require( '../../lib/tasks/export-package-as-typescript' );
	} );

	afterEach( () => {
		mockery.disable();
	} );

	it( 'should be a function', () => {
		expect( exportPackageAsTypescript ).to.be.a( 'function' );
	} );

	it( 'should call updateEntryPoint() with correct arguments', () => {
		const options = { foo: 'bar' };

		exportPackageAsTypescript( options );

		expect( stubs.updateEntryPoint.callCount ).to.equal( 1 );
		expect( stubs.updateEntryPoint.getCall( 0 ).args ).to.deep.equal( [ options, 'ts' ] );
	} );
} );

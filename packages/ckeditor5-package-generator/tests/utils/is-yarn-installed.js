/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

const { expect } = require( 'chai' );
const mockery = require( 'mockery' );
const sinon = require( 'sinon' );

describe( 'lib/utils/is-yarn-installed', () => {
	let stubs, isYarnInstalled;

	beforeEach( () => {
		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

		stubs = {
			childProcess: {
				execSync: sinon.stub()
			}
		};

		mockery.registerMock( 'child_process', stubs.childProcess );

		isYarnInstalled = require( '../../lib/utils/is-yarn-installed' );
	} );

	afterEach( () => {
		mockery.deregisterAll();
		mockery.disable();
		sinon.restore();
	} );

	it( 'should return true when yarn is installed', () => {
		stubs.childProcess.execSync.returns( '1.23.45' );

		expect( isYarnInstalled() ).to.equal( true );
	} );

	it( 'should return false when yarn is not installed', () => {
		stubs.childProcess.execSync.returns( 'false' );

		expect( isYarnInstalled() ).to.equal( false );
	} );
} );

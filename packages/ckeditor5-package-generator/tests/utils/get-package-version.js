/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const sinon = require( 'sinon' );
const expect = require( 'chai' ).expect;
const mockery = require( 'mockery' );

describe( 'lib/utils/get-package-version', () => {
	let getPackageVersion, spawnSyncStub;

	beforeEach( () => {
		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

		spawnSyncStub = sinon.stub().returns( {
			stdout: Buffer.from( JSON.stringify( {
				versions: [
					'30.0.0'
				]
			} ) )
		} );

		mockery.registerMock( 'child_process', {
			spawnSync: spawnSyncStub
		} );

		getPackageVersion = require( '../../lib/utils/get-package-version' );
	} );

	afterEach( () => {
		mockery.disable();
		sinon.restore();
	} );

	it( 'should be a function', () => {
		expect( getPackageVersion ).to.be.an( 'function' );
	} );

	it( 'returns a string', () => {
		const returnedValue = getPackageVersion( 'ckeditor5' );

		expect( returnedValue ).to.be.a( 'string' );
	} );

	it( 'calls "npm view" to determine the version', () => {
		getPackageVersion( 'ckeditor5' );

		expect( spawnSyncStub.firstCall.args[ 0 ] ).to.equal( 'npm' );
		expect( spawnSyncStub.firstCall.args[ 1 ] ).to.deep.equal( [ 'view', 'ckeditor5', '--json' ] );
		expect( spawnSyncStub.firstCall.args[ 2 ] ).to.be.an( 'object' );
	} );

	it( 'returns a version matching semantic versioning specification', () => {
		const returnedValue = getPackageVersion( 'ckeditor5' );

		expect( returnedValue ).to.equal( '30.0.0' );
	} );

	it( 'throws an error when asking about a non-existing package', () => {
		spawnSyncStub.returns( {
			stdout: Buffer.from( '' )
		} );

		expect(
			() => getPackageVersion( 'non-existing-foo-package' )
		).to.throw( 'The specified package has not been published on npm yet.', Error );
	} );
} );

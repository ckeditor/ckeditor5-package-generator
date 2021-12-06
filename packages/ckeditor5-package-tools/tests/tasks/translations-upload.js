/**
 * @license Copyright (c) 2020-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const sinon = require( 'sinon' );
const expect = require( 'chai' ).expect;
const mockery = require( 'mockery' );

describe( 'lib/tasks/translations-upload', () => {
	let translationsUpload, stubs;

	beforeEach( () => {
		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

		stubs = {
			getToken: sinon.stub(),
			devEnv: {
				uploadPotFiles: sinon.stub()
			},
			path: {
				join: sinon.stub().callsFake( ( ...chunks ) => chunks.join( '/' ) )
			}
		};

		mockery.registerMock( 'path', stubs.path );
		mockery.registerMock( 'glob', stubs.glob );
		mockery.registerMock( '@ckeditor/ckeditor5-dev-env', stubs.devEnv );
		mockery.registerMock( '@ckeditor/ckeditor5-dev-env/lib/translations/gettoken', stubs.getToken );

		translationsUpload = require( '../../lib/tasks/translations-upload' );
	} );

	afterEach( () => {
		sinon.restore();
		mockery.disable();
	} );

	it( 'should be a function', () => {
		expect( translationsUpload ).to.be.a( 'function' );
	} );

	it( 'uploads translation files', async () => {
		stubs.getToken.resolves( 'secretToken' );
		stubs.devEnv.uploadPotFiles.resolves( 'OK' );

		const results = await translationsUpload( {
			cwd: '/workspace',
			transifex: 'https://api.example.com'
		} );

		expect( results ).to.equal( 'OK' );

		expect( stubs.devEnv.uploadPotFiles.calledOnce ).to.equal( true );
		expect( stubs.devEnv.uploadPotFiles.firstCall.firstArg ).to.deep.equal( {
			token: 'secretToken',
			translationsDirectory: '/workspace/tmp/.transifex',
			url: 'https://api.example.com'
		} );
	} );

	it( 'throws an error if the "transifex" option is not specified', async () => {
		try {
			await translationsUpload( {
				cwd: '/workspace'
			} );
		} catch ( err ) {
			expect( err.message ).to.equal(
				'The URL to the Transifex API is required. Use --transifex [API end-point] to provide the value.'
			);
		}
	} );
} );

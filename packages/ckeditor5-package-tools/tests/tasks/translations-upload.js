/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
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
		mockery.registerMock( '/workspace/package.json', {
			name: '@ckeditor/ckeditor5-foo'
		} );
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
			organization: 'foo',
			project: 'bar'
		} );

		expect( results ).to.equal( 'OK' );

		expect( stubs.devEnv.uploadPotFiles.calledOnce ).to.equal( true );
		expect( stubs.devEnv.uploadPotFiles.firstCall.firstArg ).to.deep.equal( {
			token: 'secretToken',
			cwd: '/workspace',
			organizationName: 'foo',
			packages: new Map( [
				[ 'ckeditor5-foo', 'tmp/.transifex/ckeditor5-foo' ]
			] ),
			projectName: 'bar'
		} );
	} );

	it( 'throws an error if the "organization" option is not specified', async () => {
		try {
			await translationsUpload( {
				cwd: '/workspace'
			} );
		} catch ( err ) {
			expect( err.message ).to.equal(
				'The organization name is required. Use --organization [organization name] to provide the value.'
			);
		}
	} );

	it( 'throws an error if the "project" option is not specified', async () => {
		try {
			await translationsUpload( {
				cwd: '/workspace',
				organization: 'foo'
			} );
		} catch ( err ) {
			expect( err.message ).to.equal(
				'The project name is required. Use --project [project name] to provide the value.'
			);
		}
	} );

	it( 'throws an error if the "transifex" option is specified', async () => {
		try {
			await translationsUpload( {
				cwd: '/workspace',
				organization: 'foo',
				project: 'bar',
				transifex: 'https://api.example.com'
			} );
		} catch ( err ) {
			expect( err.message ).to.equal(
				'The --transifex [API end-point] option is no longer supported. Use `--organization` and `--project` instead.'
			);
		}
	} );
} );

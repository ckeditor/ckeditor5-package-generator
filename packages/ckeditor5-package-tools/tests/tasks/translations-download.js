/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const sinon = require( 'sinon' );
const expect = require( 'chai' ).expect;
const mockery = require( 'mockery' );

describe( 'lib/tasks/translations-download', () => {
	let translationsDownload, stubs;

	beforeEach( () => {
		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

		stubs = {
			getToken: sinon.stub(),
			devEnv: {
				downloadTranslations: sinon.stub()
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

		translationsDownload = require( '../../lib/tasks/translations-download' );
	} );

	afterEach( () => {
		sinon.restore();
		mockery.disable();
	} );

	it( 'should be a function', () => {
		expect( translationsDownload ).to.be.a( 'function' );
	} );

	it( 'downloads translation files', async () => {
		stubs.getToken.resolves( 'secretToken' );
		stubs.devEnv.downloadTranslations.resolves( 'OK' );

		const results = await translationsDownload( {
			cwd: '/workspace',
			organization: 'foo',
			project: 'bar'
		} );

		expect( results ).to.equal( 'OK' );

		expect( stubs.devEnv.downloadTranslations.calledOnce ).to.equal( true );
		expect( stubs.devEnv.downloadTranslations.firstCall.firstArg ).to.deep.equal( {
			token: 'secretToken',
			organizationName: 'foo',
			projectName: 'bar',
			cwd: '/workspace',
			packages: new Map( [
				[ 'ckeditor5-foo', '.' ]
			] ),
			simplifyLicenseHeader: true
		} );
	} );

	it( 'throws an error if the "organization" option is not specified', async () => {
		try {
			await translationsDownload( {
				cwd: '/workspace'
			} );
		} catch ( err ) {
			expect( err.message ).to.equal(
				'The URL to the Transifex API is required. Use --organization [organization name] to provide the value.'
			);
		}
	} );

	it( 'throws an error if the "project" option is not specified', async () => {
		try {
			await translationsDownload( {
				cwd: '/workspace',
				organization: 'foo'
			} );
		} catch ( err ) {
			expect( err.message ).to.equal(
				'The URL to the Transifex API is required. Use --project [project name] to provide the value.'
			);
		}
	} );

	it( 'throws an error if the "transifex" option is specified', async () => {
		try {
			await translationsDownload( {
				cwd: '/workspace',
				organization: 'foo',
				project: 'bar',
				transifex: 'https://api.example.com'
			} );
		} catch ( err ) {
			expect( err.message ).to.equal(
				'The -- transifex [API end-point] option is no longer supported. Use `--organization` and `--project` instead.'
			);
		}
	} );
} );

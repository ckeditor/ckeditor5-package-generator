/**
 * @license Copyright (c) 2020-2023, CKSource Holding sp. z o.o. All rights reserved.
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
			transifex: {
				getToken: sinon.stub(),
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
		mockery.registerMock( '@ckeditor/ckeditor5-dev-transifex', stubs.transifex );

		translationsDownload = require( '../../lib/tasks/translations-download' );
	} );

	afterEach( () => {
		sinon.restore();
		mockery.disable();
	} );

	it( 'should be a function', () => {
		expect( translationsDownload ).to.be.a( 'function' );
	} );

	it( 'downloads translation files for package "ckeditor5-foo"', async () => {
		mockery.registerMock( '/workspace/package.json', {
			name: 'ckeditor5-foo'
		} );

		stubs.transifex.getToken.resolves( 'secretToken' );
		stubs.transifex.downloadTranslations.resolves( 'OK' );

		const results = await translationsDownload( {
			cwd: '/workspace',
			organization: 'foo',
			project: 'bar'
		} );

		expect( results ).to.equal( 'OK' );

		expect( stubs.transifex.downloadTranslations.calledOnce ).to.equal( true );
		expect( stubs.transifex.downloadTranslations.firstCall.firstArg ).to.deep.equal( {
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

	it( 'downloads translation files for package "@ckeditor/ckeditor5-foo"', async () => {
		stubs.transifex.getToken.resolves( 'secretToken' );
		stubs.transifex.downloadTranslations.resolves( 'OK' );

		const results = await translationsDownload( {
			cwd: '/workspace',
			organization: 'foo',
			project: 'bar'
		} );

		expect( results ).to.equal( 'OK' );

		expect( stubs.transifex.downloadTranslations.calledOnce ).to.equal( true );
		expect( stubs.transifex.downloadTranslations.firstCall.firstArg ).to.deep.equal( {
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
				'The organization name is required. Use --organization [organization name] to provide the value.'
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
				'The project name is required. Use --project [project name] to provide the value.'
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
				'The --transifex [API end-point] option is no longer supported. Use `--organization` and `--project` instead.'
			);
		}
	} );
} );

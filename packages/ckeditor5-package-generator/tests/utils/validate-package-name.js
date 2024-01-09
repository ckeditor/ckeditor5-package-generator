/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const mockery = require( 'mockery' );
const sinon = require( 'sinon' );
const { expect } = require( 'chai' );

describe( 'lib/utils/validate-package-name', () => {
	let stubs, validatePackageName;

	beforeEach( () => {
		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

		stubs = {
			logger: {
				process: sinon.stub(),
				error: sinon.stub(),
				info: sinon.stub()
			},
			process: {
				exit: sinon.stub( process, 'exit' )
			},
			chalk: {
				red: sinon.stub().callsFake( str => str ),
				green: sinon.stub().callsFake( str => str ),
				blue: sinon.stub().callsFake( str => str )
			}
		};

		mockery.registerMock( 'chalk', stubs.chalk );

		validatePackageName = require( '../../lib/utils/validate-package-name' );
	} );

	afterEach( () => {
		mockery.deregisterAll();
		sinon.restore();
	} );

	it( 'should be a function', () => {
		expect( validatePackageName ).to.be.an( 'function' );
	} );

	it( 'logs the process', () => {
		validatePackageName( stubs.logger, undefined );

		expect( stubs.logger.process.calledOnce ).to.equal( true );
		expect( stubs.logger.process.firstCall.firstArg ).to.equal( 'Verifying the specified package name.' );
	} );

	it( 'logs info about correct package name format in case of incorrect name', () => {
		validatePackageName( stubs.logger, 'foo-bar' );

		expect( stubs.logger.error.calledTwice ).to.equal( true );
		expect( stubs.logger.error.getCall( 0 ).firstArg ).to.equal( '❗ Found an error while verifying the provided package name:' );

		expect( stubs.logger.info.calledThrice ).to.equal( true );
		expect( stubs.logger.info.getCall( 0 ).firstArg ).to.equal( 'Expected pattern:            @[scope]/ckeditor5-[feature-name]' );
		expect( stubs.logger.info.getCall( 1 ).firstArg ).to.equal( 'The provided package name:   foo-bar' );
		expect( stubs.logger.info.getCall( 2 ).firstArg ).to.equal( 'Allowed characters list:     0-9 a-z - . _' );
	} );

	describe( 'verifying package name length', () => {
		it( 'rejects undefined value', () => {
			validatePackageName( stubs.logger, undefined );

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal(
				'The package name cannot be an empty string - pass the name as the first argument to the script.'
			);
		} );

		it( 'rejects an empty package name', () => {
			validatePackageName( stubs.logger, '' );

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal(
				'The package name cannot be an empty string - pass the name as the first argument to the script.'
			);
		} );

		it( 'accepts a name lesser than 214 characters', () => {
			validatePackageName( stubs.logger, '@ckeditor/ckeditor5-foo' );

			expect( stubs.process.exit.called ).to.equal( false );
			expect( stubs.logger.error.called ).to.equal( false );
		} );

		it( 'accepts the length of a name equal to 214', () => {
			// 214 is a limit, 21 is the length of the string, the rest is "o".
			validatePackageName( stubs.logger, '@ckeditor/ckeditor5-f' + 'o'.repeat( 193 ) );

			expect( stubs.process.exit.called ).to.equal( false );
			expect( stubs.logger.error.called ).to.equal( false );
		} );

		it( 'rejects a name longer than 214 characters', () => {
			// 214 is a limit, 21 is the length of the string, the rest is "o". Add 1 to exceed the limit.
			validatePackageName( stubs.logger, '@ckeditor/ckeditor5-f' + 'o'.repeat( 194 ) );

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal(
				'The length of the package name cannot be longer than 214 characters.'
			);
		} );
	} );

	describe( 'verifying capital letters', () => {
		it( 'rejects a package name if it contains at least a single capital letter', () => {
			validatePackageName( stubs.logger, '@ckeditor/ckeditor5-Foo' );

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal( 'The package name cannot contain capital letters.' );
		} );
	} );

	describe( 'verifying compliance with the pattern', () => {
		it( 'rejects the package name without a scope', () => {
			validatePackageName( stubs.logger, 'ckeditor5-foo' );

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal(
				'The package name must match the "@[scope]/ckeditor5-[feature-name]" pattern.'
			);
		} );

		it( 'rejects the package name if the scope misses the "at" (@) character at the beginning', () => {
			validatePackageName( stubs.logger, 'ckeditor/ckeditor5-foo' );

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal(
				'The package name must match the "@[scope]/ckeditor5-[feature-name]" pattern.'
			);
		} );

		it( 'rejects the package name if the name ends with the slash (/)', () => {
			validatePackageName( stubs.logger, '@ckeditor/ckeditor5-foo/' );

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal(
				'The package name must match the "@[scope]/ckeditor5-[feature-name]" pattern.'
			);
		} );

		it( 'rejects the package name if it does not match to the ckeditor5-* pattern (missing "ckeditor5-" prefix)', () => {
			validatePackageName( stubs.logger, '@ckeditor/foo' );

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal(
				'The package name must match the "@[scope]/ckeditor5-[feature-name]" pattern.'
			);
		} );

		it( 'rejects the package name if it does not match to the ckeditor5-* pattern (missing hyphen-minus)', () => {
			validatePackageName( stubs.logger, '@ckeditor/ckeditor5_foo' );

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal(
				'The package name must match the "@[scope]/ckeditor5-[feature-name]" pattern.'
			);
		} );
	} );

	describe( 'verifying allowed characters', () => {
		it( 'rejects if the package name contains non-friendly URL characters - check ~', () => {
			validatePackageName( stubs.logger, '@ckeditor/ckeditor5-foo~foo' );

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal( 'The package name contains non-allowed characters.' );
		} );

		it( 'rejects if the package name contains non-friendly URL characters - check \'', () => {
			validatePackageName( stubs.logger, '@ckeditor/ckeditor5-foo\'foo' );

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal( 'The package name contains non-allowed characters.' );
		} );

		it( 'rejects if the package name contains non-friendly URL characters - check !', () => {
			validatePackageName( stubs.logger, '@ckeditor/ckeditor5-foo!foo' );

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal( 'The package name contains non-allowed characters.' );
		} );

		it( 'rejects if the package name contains non-friendly URL characters - check (', () => {
			validatePackageName( stubs.logger, '@ckeditor/ckeditor5-foo(foo' );

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal( 'The package name contains non-allowed characters.' );
		} );

		it( 'rejects if the package name contains non-friendly URL characters - check )', () => {
			validatePackageName( stubs.logger, '@ckeditor/ckeditor5-foo)foo' );

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal( 'The package name contains non-allowed characters.' );
		} );

		it( 'rejects if the package name contains non-friendly URL characters - check *', () => {
			validatePackageName( stubs.logger, '@ckeditor/ckeditor5-foo*foo' );

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal( 'The package name contains non-allowed characters.' );
		} );

		it( 'rejects if the scope contains non-alphanumeric characters', () => {
			validatePackageName( stubs.logger, '@ćkèditör/ckeditor5-foo' );

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal( 'The package name contains non-allowed characters.' );
		} );

		it( 'rejects if the package name contains non-alphanumeric characters', () => {
			validatePackageName( stubs.logger, '@ckeditor/ckeditor5-fø' );

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal( 'The package name contains non-allowed characters.' );
		} );
	} );

	it( 'returns null for a valid package name', () => {
		validatePackageName( stubs.logger, '@scope/ckeditor5-test-package' );

		expect( stubs.process.exit.called ).to.equal( false );
		expect( stubs.logger.error.called ).to.equal( false );
	} );
} );

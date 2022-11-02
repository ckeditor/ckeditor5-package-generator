/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const mockery = require( 'mockery' );
const sinon = require( 'sinon' );
const { expect } = require( 'chai' );

describe( 'lib/utils/get-package-name', () => {
	let stubs, getPackageName;

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
				// Since the the stub does not exit, we will have to catch any errors that occur afterwards.
				exit: sinon.stub( process, 'exit' )
			},
			chalk: {
				red: sinon.stub().callsFake( str => str ),
				green: sinon.stub().callsFake( str => str ),
				blue: sinon.stub().callsFake( str => str )
			}
		};

		mockery.registerMock( 'chalk', stubs.chalk );

		getPackageName = require( '../../lib/utils/get-package-name' );
	} );

	afterEach( () => {
		mockery.deregisterAll();
		sinon.restore();
	} );

	it( 'should be a function', () => {
		expect( getPackageName ).to.be.an( 'function' );
	} );

	it( 'logs the process', () => {
		try {
			getPackageName( stubs.logger, undefined, {} );
		} catch ( err ) {
			expect( err.message ).to.equal( 'Cannot read properties of undefined (reading \'length\')' );
		}

		expect( stubs.process.exit.called ).to.equal( true );
		expect( stubs.process.exit.firstCall.firstArg ).to.equal( 1 );

		expect( stubs.logger.process.calledOnce ).to.equal( true );
		expect( stubs.logger.process.firstCall.firstArg ).to.equal( 'Verifying the specified package name.' );
	} );

	it( 'logs info about correct package name format in case of incorrect name', () => {
		try {
			getPackageName( stubs.logger, 'foo-bar', {} );
		} catch ( err ) {
			expect( err.message ).to.equal( 'object null is not iterable (cannot read property Symbol(Symbol.iterator))' );
		}

		expect( stubs.process.exit.called ).to.equal( true );
		expect( stubs.process.exit.firstCall.firstArg ).to.equal( 1 );

		expect( stubs.logger.error.calledTwice ).to.equal( true );
		expect( stubs.logger.error.getCall( 0 ).firstArg ).to.equal( '❗ Found an error while verifying the provided package name:' );

		expect( stubs.logger.info.calledThrice ).to.equal( true );
		expect( stubs.logger.info.getCall( 0 ).firstArg ).to.equal( 'Expected pattern:            @[scope]/ckeditor5-[feature-name]' );
		expect( stubs.logger.info.getCall( 1 ).firstArg ).to.equal( 'The provided package name:   foo-bar' );
		expect( stubs.logger.info.getCall( 2 ).firstArg ).to.equal( 'Allowed characters list:     0-9 a-z - . _' );
	} );

	it( 'returns correct package names for a one word package name', () => {
		const result = getPackageName( stubs.logger, '@foo/ckeditor5-bar', {} );

		expect( result ).to.deep.equal( {
			fullScoped: '@foo/ckeditor5-bar',
			pascalCase: 'Bar',
			camelCase: 'bar',
			kebabCase: 'bar',
			lowerCase: 'bar',
			spacedOut: 'Bar'
		} );
	} );

	it( 'returns correct package names for a two word package name', () => {
		const result = getPackageName( stubs.logger, '@foo/ckeditor5-bar-baz', {} );

		expect( result ).to.deep.equal( {
			fullScoped: '@foo/ckeditor5-bar-baz',
			pascalCase: 'BarBaz',
			camelCase: 'barBaz',
			kebabCase: 'bar-baz',
			lowerCase: 'barbaz',
			spacedOut: 'Bar baz'
		} );
	} );

	it( 'returns correct package names for a three word package name', () => {
		const result = getPackageName( stubs.logger, '@foo/ckeditor5-bar-baz-qux', {} );

		expect( result ).to.deep.equal( {
			fullScoped: '@foo/ckeditor5-bar-baz-qux',
			pascalCase: 'BarBazQux',
			camelCase: 'barBazQux',
			kebabCase: 'bar-baz-qux',
			lowerCase: 'barbazqux',
			spacedOut: 'Bar baz qux'
		} );
	} );

	describe( '"name" option', () => {
		it( 'returns correct package names for a one word package name', () => {
			const result = getPackageName( stubs.logger, '@foo/ckeditor5-xyz', { name: 'Bar' } );

			expect( result ).to.deep.equal( {
				fullScoped: '@foo/ckeditor5-xyz',
				pascalCase: 'Bar',
				camelCase: 'bar',
				kebabCase: 'bar',
				lowerCase: 'bar',
				spacedOut: 'Bar'
			} );
		} );

		it( 'returns correct package names for a two word package name', () => {
			const result = getPackageName( stubs.logger, '@foo/ckeditor5-xyz', { name: 'BarBaz' } );

			expect( result ).to.deep.equal( {
				fullScoped: '@foo/ckeditor5-xyz',
				pascalCase: 'BarBaz',
				camelCase: 'barBaz',
				kebabCase: 'bar-baz',
				lowerCase: 'barbaz',
				spacedOut: 'Bar baz'
			} );
		} );

		it( 'returns correct package names for a three word package name', () => {
			const result = getPackageName( stubs.logger, '@foo/ckeditor5-xyz', { name: 'BarBazQux' } );

			expect( result ).to.deep.equal( {
				fullScoped: '@foo/ckeditor5-xyz',
				pascalCase: 'BarBazQux',
				camelCase: 'barBazQux',
				kebabCase: 'bar-baz-qux',
				lowerCase: 'barbazqux',
				spacedOut: 'Bar baz qux'
			} );
		} );

		it( 'returns correct package names for if the package name starts with lowercase letter', () => {
			const result = getPackageName( stubs.logger, '@foo/ckeditor5-xyz', { name: 'barBazQux' } );

			expect( result ).to.deep.equal( {
				fullScoped: '@foo/ckeditor5-xyz',
				pascalCase: 'BarBazQux',
				camelCase: 'barBazQux',
				kebabCase: 'bar-baz-qux',
				lowerCase: 'barbazqux',
				spacedOut: 'Bar baz qux'
			} );
		} );

		it( 'rejects if the package name contains hyphen-minus', () => {
			getPackageName( stubs.logger, '@foo/ckeditor5-xyz', { name: 'Bar-Baz-Qux' } );

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.process.exit.firstCall.firstArg ).to.equal( 1 );

			expect( stubs.logger.error.calledTwice ).to.equal( true );
			expect( stubs.logger.error.getCall( 0 ).firstArg ).to.equal( 'Class name should only contain letters!' );
			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal( 'Provided name: "Bar-Baz-Qux"' );
		} );

		it( 'rejects if the package name contains dots', () => {
			getPackageName( stubs.logger, '@foo/ckeditor5-xyz', { name: 'Bar.Baz.Qux' } );

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.process.exit.firstCall.firstArg ).to.equal( 1 );

			expect( stubs.logger.error.calledTwice ).to.equal( true );
			expect( stubs.logger.error.getCall( 0 ).firstArg ).to.equal( 'Class name should only contain letters!' );
			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal( 'Provided name: "Bar.Baz.Qux"' );
		} );

		it( 'rejects if the package name contains underscores', () => {
			getPackageName( stubs.logger, '@foo/ckeditor5-xyz', { name: 'Bar_Baz_Qux' } );

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.process.exit.firstCall.firstArg ).to.equal( 1 );

			expect( stubs.logger.error.calledTwice ).to.equal( true );
			expect( stubs.logger.error.getCall( 0 ).firstArg ).to.equal( 'Class name should only contain letters!' );
			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal( 'Provided name: "Bar_Baz_Qux"' );
		} );

		it( 'rejects if the package name contains spaces', () => {
			getPackageName( stubs.logger, '@foo/ckeditor5-xyz', { name: 'Bar Baz Qux' } );

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.process.exit.firstCall.firstArg ).to.equal( 1 );

			expect( stubs.logger.error.calledTwice ).to.equal( true );
			expect( stubs.logger.error.getCall( 0 ).firstArg ).to.equal( 'Class name should only contain letters!' );
			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal( 'Provided name: "Bar Baz Qux"' );
		} );

		it( 'rejects if the package name contains invalid characters', () => {
			getPackageName( stubs.logger, '@foo/ckeditor5-xyz', { name: 'Bąr &az 9ux' } );

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.process.exit.firstCall.firstArg ).to.equal( 1 );

			expect( stubs.logger.error.calledTwice ).to.equal( true );
			expect( stubs.logger.error.getCall( 0 ).firstArg ).to.equal( 'Class name should only contain letters!' );
			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal( 'Provided name: "Bąr &az 9ux"' );
		} );
	} );

	describe( 'verifying package name length', () => {
		it( 'rejects undefined value', () => {
			try {
				getPackageName( stubs.logger, undefined, {} );
			} catch ( err ) {
				expect( err.message ).to.equal( 'Cannot read properties of undefined (reading \'length\')' );
			}

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.process.exit.firstCall.firstArg ).to.equal( 1 );

			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal(
				'The package name is missing - pass the name as the first argument to the script.'
			);
		} );

		it( 'rejects an empty package name', () => {
			try {
				getPackageName( stubs.logger, '', {} );
			} catch ( err ) {
				expect( err.message ).to.equal( 'object null is not iterable (cannot read property Symbol(Symbol.iterator))' );
			}

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.process.exit.firstCall.firstArg ).to.equal( 1 );

			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal(
				'The package name is missing - pass the name as the first argument to the script.'
			);
		} );

		it( 'accepts a name lesser than 214 characters', () => {
			getPackageName( stubs.logger, '@ckeditor/ckeditor5-foo', {} );

			expect( stubs.process.exit.called ).to.equal( false );
			expect( stubs.logger.error.called ).to.equal( false );
		} );

		it( 'accepts the length of a name equal to 214', () => {
			// 214 is a limit, 21 is the length of the string, the rest is "o".
			getPackageName( stubs.logger, '@ckeditor/ckeditor5-f' + 'o'.repeat( 193 ), {} );

			expect( stubs.process.exit.called ).to.equal( false );
			expect( stubs.logger.error.called ).to.equal( false );
		} );

		it( 'rejects a name longer than 214 characters', () => {
			// 214 is a limit, 21 is the length of the string, the rest is "o". Add 1 to exceed the limit.
			getPackageName( stubs.logger, '@ckeditor/ckeditor5-f' + 'o'.repeat( 194 ), {} );

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.process.exit.firstCall.firstArg ).to.equal( 1 );

			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal(
				'The length of the package name cannot be longer than 214 characters.'
			);
		} );
	} );

	describe( 'verifying capital letters', () => {
		it( 'rejects a package name if it contains at least a single capital letter', () => {
			getPackageName( stubs.logger, '@ckeditor/ckeditor5-Foo', {} );

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.process.exit.firstCall.firstArg ).to.equal( 1 );

			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal( 'The package name cannot contain capital letters.' );
		} );
	} );

	describe( 'verifying compliance with the pattern', () => {
		it( 'rejects the package name without a scope', () => {
			try {
				getPackageName( stubs.logger, 'ckeditor5-foo', {} );
			} catch ( err ) {
				expect( err.message ).to.equal( 'object null is not iterable (cannot read property Symbol(Symbol.iterator))' );
			}

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.process.exit.firstCall.firstArg ).to.equal( 1 );

			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal(
				'The package name must match the "@[scope]/ckeditor5-[feature-name]" pattern.'
			);
		} );

		it( 'rejects the package name if the scope misses the "at" (@) character at the beginning', () => {
			try {
				getPackageName( stubs.logger, 'ckeditor/ckeditor5-foo', {} );
			} catch ( err ) {
				expect( err.message ).to.equal( 'object null is not iterable (cannot read property Symbol(Symbol.iterator))' );
			}

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.process.exit.firstCall.firstArg ).to.equal( 1 );

			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal(
				'The package name must match the "@[scope]/ckeditor5-[feature-name]" pattern.'
			);
		} );

		it( 'rejects the package name if the name ends with the slash (/)', () => {
			try {
				getPackageName( stubs.logger, '@ckeditor/ckeditor5-foo/', {} );
			} catch ( err ) {
				expect( err.message ).to.equal( 'object null is not iterable (cannot read property Symbol(Symbol.iterator))' );
			}

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.process.exit.firstCall.firstArg ).to.equal( 1 );

			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal(
				'The package name must match the "@[scope]/ckeditor5-[feature-name]" pattern.'
			);
		} );

		it( 'rejects the package name if it does not match to the ckeditor5-* pattern (missing "ckeditor5-" prefix)', () => {
			try {
				getPackageName( stubs.logger, '@ckeditor/foo', {} );
			} catch ( err ) {
				expect( err.message ).to.equal( 'object null is not iterable (cannot read property Symbol(Symbol.iterator))' );
			}

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.process.exit.firstCall.firstArg ).to.equal( 1 );

			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal(
				'The package name must match the "@[scope]/ckeditor5-[feature-name]" pattern.'
			);
		} );

		it( 'rejects the package name if it does not match to the ckeditor5-* pattern (missing hyphen-minus)', () => {
			try {
				getPackageName( stubs.logger, '@ckeditor/ckeditor5_foo', {} );
			} catch ( err ) {
				expect( err.message ).to.equal( 'object null is not iterable (cannot read property Symbol(Symbol.iterator))' );
			}

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.process.exit.firstCall.firstArg ).to.equal( 1 );

			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal(
				'The package name must match the "@[scope]/ckeditor5-[feature-name]" pattern.'
			);
		} );
	} );

	describe( 'verifying allowed characters', () => {
		it( 'rejects if the package name contains non-friendly URL characters - check ~', () => {
			getPackageName( stubs.logger, '@ckeditor/ckeditor5-foo~foo', {} );

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.process.exit.firstCall.firstArg ).to.equal( 1 );

			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal( 'The package name contains non-allowed characters.' );
		} );

		it( 'rejects if the package name contains non-friendly URL characters - check \'', () => {
			getPackageName( stubs.logger, '@ckeditor/ckeditor5-foo\'foo', {} );

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.process.exit.firstCall.firstArg ).to.equal( 1 );

			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal( 'The package name contains non-allowed characters.' );
		} );

		it( 'rejects if the package name contains non-friendly URL characters - check !', () => {
			getPackageName( stubs.logger, '@ckeditor/ckeditor5-foo!foo', {} );

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.process.exit.firstCall.firstArg ).to.equal( 1 );

			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal( 'The package name contains non-allowed characters.' );
		} );

		it( 'rejects if the package name contains non-friendly URL characters - check (', () => {
			getPackageName( stubs.logger, '@ckeditor/ckeditor5-foo(foo', {} );

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.process.exit.firstCall.firstArg ).to.equal( 1 );

			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal( 'The package name contains non-allowed characters.' );
		} );

		it( 'rejects if the package name contains non-friendly URL characters - check )', () => {
			getPackageName( stubs.logger, '@ckeditor/ckeditor5-foo)foo', {} );

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.process.exit.firstCall.firstArg ).to.equal( 1 );

			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal( 'The package name contains non-allowed characters.' );
		} );

		it( 'rejects if the package name contains non-friendly URL characters - check *', () => {
			getPackageName( stubs.logger, '@ckeditor/ckeditor5-foo*foo', {} );

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.process.exit.firstCall.firstArg ).to.equal( 1 );

			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal( 'The package name contains non-allowed characters.' );
		} );

		it( 'rejects if the scope contains non-alphanumeric characters', () => {
			getPackageName( stubs.logger, '@ćkèditör/ckeditor5-foo', {} );

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.process.exit.firstCall.firstArg ).to.equal( 1 );

			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal( 'The package name contains non-allowed characters.' );
		} );

		it( 'rejects if the package name contains non-alphanumeric characters', () => {
			getPackageName( stubs.logger, '@ckeditor/ckeditor5-føo', {} );

			expect( stubs.process.exit.called ).to.equal( true );
			expect( stubs.process.exit.firstCall.firstArg ).to.equal( 1 );

			expect( stubs.logger.error.getCall( 1 ).firstArg ).to.equal( 'The package name contains non-allowed characters.' );
		} );
	} );
} );


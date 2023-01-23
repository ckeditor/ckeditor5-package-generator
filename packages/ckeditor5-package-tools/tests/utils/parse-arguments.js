/**
 * @license Copyright (c) 2020-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const sinon = require( 'sinon' );
const expect = require( 'chai' ).expect;

describe( 'lib/utils/parse-arguments', () => {
	let parseArguments;

	beforeEach( () => {
		parseArguments = require( '../../lib/utils/parse-arguments' );
	} );

	afterEach( () => {
		sinon.restore();
	} );

	it( 'should be a function', () => {
		expect( parseArguments ).to.be.a( 'function' );
	} );

	it( 'returns the default values if modifiers are not specified', () => {
		sinon.stub( process, 'cwd' ).returns( '/cwd' );
		const options = parseArguments( [ 'task-to-execute' ] );

		expect( options.coverage ).to.equal( false );
		expect( options.sourceMap ).to.equal( false );
		expect( options.production ).to.equal( false );
		expect( options.verbose ).to.equal( false );
		expect( options.watch ).to.equal( false );
		expect( options.open ).to.equal( true );
		expect( options.language ).to.equal( 'en' );
		expect( options.organization ).to.equal( null );
		expect( options.project ).to.equal( null );
		expect( options.transifex ).to.equal( undefined );
	} );

	it( 'assigns the current work directory as the "#cwd" property', () => {
		sinon.stub( process, 'cwd' ).returns( '/cwd' );
		const options = parseArguments( [ 'task-to-execute' ] );

		expect( options.cwd ).to.equal( '/cwd' );
	} );

	it( 'assigns the specified task as the "#task" property', () => {
		const options = parseArguments( [ 'task-to-execute' ] );

		expect( options.task ).to.equal( 'task-to-execute' );
	} );

	it( 'allows specifying the coverage option', () => {
		const options = parseArguments( [ 'task-to-execute', '--coverage' ] );

		expect( options.coverage ).to.equal( true );
	} );

	it( 'allows specifying the coverage option (using an alias)', () => {
		const options = parseArguments( [ 'task-to-execute', '-c' ] );

		expect( options.coverage ).to.equal( true );
	} );

	it( 'allows specifying the source-map option', () => {
		const options = parseArguments( [ 'task-to-execute', '--source-map' ] );

		expect( options.sourceMap ).to.equal( true );
	} );

	it( 'allows specifying the source-map option (using an alias)', () => {
		const options = parseArguments( [ 'task-to-execute', '-s' ] );

		expect( options.sourceMap ).to.equal( true );
	} );

	it( 'allows specifying the verbose option', () => {
		const options = parseArguments( [ 'task-to-execute', '--verbose' ] );

		expect( options.verbose ).to.equal( true );
	} );

	it( 'allows specifying the verbose option (using an alias)', () => {
		const options = parseArguments( [ 'task-to-execute', '-v' ] );

		expect( options.verbose ).to.equal( true );
	} );

	it( 'allows specifying the watch option', () => {
		const options = parseArguments( [ 'task-to-execute', '--watch' ] );

		expect( options.watch ).to.equal( true );
	} );

	it( 'allows specifying the watch option (using an alias)', () => {
		const options = parseArguments( [ 'task-to-execute', '-w' ] );

		expect( options.watch ).to.equal( true );
	} );

	it( 'allows specifying the production option', () => {
		const options = parseArguments( [ 'task-to-execute', '--production' ] );

		expect( options.production ).to.equal( true );
	} );

	it( 'allows specifying many modifiers', () => {
		const options = parseArguments( [ 'task-to-execute', '--watch', '--coverage', '-s' ] );

		expect( options.watch ).to.equal( true );
		expect( options.coverage ).to.equal( true );
		expect( options.sourceMap ).to.equal( true );
	} );

	it( 'does not attach aliases as available properties in the returned object', () => {
		const options = parseArguments( [ 'task-to-execute' ] );

		expect( options.c ).to.equal( undefined );
		expect( options.s ).to.equal( undefined );
		expect( options.v ).to.equal( undefined );
		expect( options.w ).to.equal( undefined );
	} );

	it( 'allows set to `false` the "open" option by passing "--no-open"', () => {
		const options = parseArguments( [ 'task-to-execute', '--no-open' ] );

		expect( options.open ).to.equal( false );
	} );

	it( 'allows specifying the language option', () => {
		const options = parseArguments( [ 'task-to-execute', '--language', 'pl' ] );

		expect( options.language ).to.equal( 'pl' );
	} );

	it( 'allows specifying the organization option', () => {
		const options = parseArguments( [ 'task-to-execute', '--organization', 'bar' ] );

		expect( options.organization ).to.equal( 'bar' );
	} );

	it( 'allows specifying the project option', () => {
		const options = parseArguments( [ 'task-to-execute', '--project', 'foo' ] );

		expect( options.project ).to.equal( 'foo' );
	} );
} );

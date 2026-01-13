/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi } from 'vitest';
import parseArguments from '../../lib/utils/parse-arguments.js';

describe( 'lib/utils/parse-arguments', () => {
	it( 'should be a function', () => {
		expect( parseArguments ).toBeTypeOf( 'function' );
	} );

	it( 'returns the default values if modifiers are not specified', () => {
		vi.spyOn( process, 'cwd' ).mockReturnValue( '/cwd' );

		const options = parseArguments( [ 'task-to-execute' ] );

		expect( options.production ).toEqual( false );
		expect( options.verbose ).toEqual( false );
		expect( options.open ).toEqual( true );
		expect( options.language ).toEqual( 'en' );
		expect( options.validateOnly ).toEqual( false );
	} );

	it( 'assigns the current work directory as the "#cwd" property', () => {
		vi.spyOn( process, 'cwd' ).mockReturnValue( '/cwd' );

		const options = parseArguments( [ 'task-to-execute' ] );

		expect( options.cwd ).toEqual( '/cwd' );
	} );

	it( 'assigns the specified task as the "#task" property', () => {
		const options = parseArguments( [ 'task-to-execute' ] );

		expect( options.task ).toEqual( 'task-to-execute' );
	} );

	it( 'allows specifying the verbose option', () => {
		const options = parseArguments( [ 'task-to-execute', '--verbose' ] );

		expect( options.verbose ).toEqual( true );
	} );

	it( 'allows specifying the verbose option (using an alias)', () => {
		const options = parseArguments( [ 'task-to-execute', '-v' ] );

		expect( options.verbose ).toEqual( true );
	} );

	it( 'allows specifying the production option', () => {
		const options = parseArguments( [ 'task-to-execute', '--production' ] );

		expect( options.production ).toEqual( true );
	} );

	it( 'allows specifying many modifiers', () => {
		const options = parseArguments( [ 'task-to-execute', '--production', '--verbose' ] );

		expect( options.production ).toEqual( true );
		expect( options.verbose ).toEqual( true );
	} );

	it( 'does not attach aliases as available properties in the returned object', () => {
		const options = parseArguments( [ 'task-to-execute' ] );

		expect( options.v ).toEqual( undefined );
		expect( options.w ).toEqual( undefined );
	} );

	it( 'allows set to `false` the "open" option by passing "--no-open"', () => {
		const options = parseArguments( [ 'task-to-execute', '--no-open' ] );

		expect( options.open ).toEqual( false );
	} );

	it( 'allows specifying the language option', () => {
		const options = parseArguments( [ 'task-to-execute', '--language', 'pl' ] );

		expect( options.language ).toEqual( 'pl' );
	} );

	it( 'allows specifying the validate-only mode option', () => {
		const options = parseArguments( [ 'task-to-execute', '--validate-only' ] );

		expect( options.validateOnly ).toEqual( true );
	} );
} );

/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cancel, intro, isCancel, note, outro, select, spinner, text } from '@clack/prompts';
import { createSpinner, promptSelect, promptText, showIntro, showNote, showOutro } from '../../lib/utils/prompt.js';

vi.mock( '@clack/prompts', () => ( {
	cancel: vi.fn(),
	intro: vi.fn(),
	isCancel: vi.fn(),
	note: vi.fn(),
	outro: vi.fn(),
	select: vi.fn(),
	spinner: vi.fn(),
	text: vi.fn()
} ) );

describe( 'lib/utils/prompt', () => {
	beforeEach( () => {
		vi.mocked( isCancel ).mockReturnValue( false );
	} );

	it( 'forwards intro calls', () => {
		showIntro( 'CKEditor 5 package generator' );

		expect( intro ).toHaveBeenCalledWith( 'CKEditor 5 package generator' );
	} );

	it( 'forwards outro calls', () => {
		showOutro( 'Done!' );

		expect( outro ).toHaveBeenCalledWith( 'Done!' );
	} );

	it( 'forwards note calls', () => {
		showNote( 'Helpful note', 'Package name' );

		expect( note ).toHaveBeenCalledWith( 'Helpful note', 'Package name', {
			format: expect.any( Function )
		} );
	} );

	it( 'creates clack spinners', () => {
		const mockedSpinner = { start: vi.fn(), stop: vi.fn(), message: vi.fn() };

		vi.mocked( spinner ).mockReturnValue( mockedSpinner );

		expect( createSpinner() ).toBe( mockedSpinner );
		expect( spinner ).toHaveBeenCalledTimes( 1 );
	} );

	it( 'returns text prompt values', async () => {
		vi.mocked( text ).mockResolvedValue( 'ckeditor5-widget' );

		const result = await promptText( { message: 'Package name' } );

		expect( result ).toEqual( 'ckeditor5-widget' );
		expect( text ).toHaveBeenCalledWith( { message: 'Package name' } );
	} );

	it( 'returns select prompt values', async () => {
		vi.mocked( select ).mockResolvedValue( 'pnpm' );

		const result = await promptSelect( {
			message: 'Package manager',
			options: [ { value: 'pnpm', label: 'pnpm' } ]
		} );

		expect( result ).toEqual( 'pnpm' );
	} );

	it( 'throws SIGINT when text prompt is cancelled', async () => {
		const cancelSymbol = Symbol( 'cancelled' );

		vi.mocked( text ).mockResolvedValue( cancelSymbol );
		vi.mocked( isCancel ).mockReturnValue( true );

		await expect( promptText( { message: 'Package name' } ) ).rejects.toThrow( 'SIGINT' );
		expect( cancel ).toHaveBeenCalledWith( 'Operation cancelled.' );
	} );

	it( 'throws SIGINT when select prompt is cancelled', async () => {
		const cancelSymbol = Symbol( 'cancelled' );

		vi.mocked( select ).mockResolvedValue( cancelSymbol );
		vi.mocked( isCancel ).mockReturnValue( true );

		await expect( promptSelect( {
			message: 'Package manager',
			options: [ { value: 'npm', label: 'npm' } ]
		} ) ).rejects.toThrow( 'SIGINT' );
		expect( cancel ).toHaveBeenCalledWith( 'Operation cancelled.' );
	} );
} );

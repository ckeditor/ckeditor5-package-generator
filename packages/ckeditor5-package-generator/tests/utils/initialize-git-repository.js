/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi } from 'vitest';
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import initializeGitRepository from '../../lib/utils/initialize-git-repository.js';

vi.mock( 'fs' );
vi.mock( 'child_process' );

describe( 'lib/utils/initialize-git-repository', () => {
	const directoryPath = 'directory/path/foo';

	it( 'should be a function', () => {
		expect( initializeGitRepository ).toBeTypeOf( 'function' );
	} );

	it( 'initializes the repository', () => {
		initializeGitRepository( directoryPath );

		expect( execSync ).toHaveBeenCalledTimes( 3 );
		expect( execSync ).toHaveBeenNthCalledWith( 1, 'git init', { stdio: 'ignore', cwd: directoryPath } );
	} );

	it( 'commits files to the repository', () => {
		initializeGitRepository( directoryPath );

		expect( execSync ).toHaveBeenCalledTimes( 3 );
		expect( execSync ).toHaveBeenNthCalledWith( 2, 'git add -A', { stdio: 'ignore', cwd: directoryPath } );
		expect( execSync ).toHaveBeenNthCalledWith(
			3,
			'git commit -m "Initialize the repository using CKEditor 5 Package Generator."',
			{ stdio: 'ignore', cwd: directoryPath }
		);
	} );

	it( 'in case of an error during committing, removes the .git directory', () => {
		vi.mocked( execSync )
			.mockImplementationOnce( () => {} )
			.mockImplementationOnce( () => {} )
			.mockImplementationOnce( () => {
				throw new Error( 'Custom error message.' );
			} );

		initializeGitRepository( directoryPath );

		expect( fs.rmSync ).toHaveBeenCalledTimes( 1 );
		expect( fs.rmSync ).toHaveBeenCalledWith( 'directory/path/foo/.git', { recursive: true, force: true } );
	} );
} );

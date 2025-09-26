/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import { execSync } from 'child_process';
import initializeGitRepository from '../../lib/utils/initialize-git-repository.js';

vi.mock( 'fs' );
vi.mock( 'child_process' );

describe( 'lib/utils/initialize-git-repository', () => {
	let stubs;

	const directoryPath = 'directory/path/foo';

	beforeEach( () => {
		stubs = {
			logger: {
				process: vi.fn()
			}
		};
	} );

	it( 'should be a function', () => {
		expect( initializeGitRepository ).toBeTypeOf( 'function' );
	} );

	it( 'logs the process', () => {
		initializeGitRepository( directoryPath, stubs.logger );

		expect( stubs.logger.process ).toHaveBeenCalledTimes( 1 );
		expect( stubs.logger.process ).toHaveBeenCalledWith( 'Initializing Git repository...' );
	} );

	it( 'initializes the repository', () => {
		initializeGitRepository( directoryPath, stubs.logger );

		expect( execSync ).toHaveBeenCalledTimes( 3 );
		expect( execSync ).toHaveBeenNthCalledWith( 1, 'git init', { stdio: 'ignore', cwd: directoryPath } );
	} );

	it( 'commits files to the repository', () => {
		initializeGitRepository( directoryPath, stubs.logger );

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

		initializeGitRepository( directoryPath, stubs.logger );

		expect( fs.rmSync ).toHaveBeenCalledTimes( 1 );
		expect( fs.rmSync ).toHaveBeenCalledWith( 'directory/path/foo/.git', { recursive: true, force: true } );
	} );
} );

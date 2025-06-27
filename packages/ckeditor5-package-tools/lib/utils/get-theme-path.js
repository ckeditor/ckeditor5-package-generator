/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import fs from 'fs-extra';
import path from 'path';

/**
 * Locate the node_modules folder containg a package path starting from the current working directory
 * @param {string} currentDir - The starting directory
 * @param {string} packagePath - The package path to search for
 * @returns {string|null} - The path to the node_modules folder, or null if not found
 */
function locateNodeModules( currentDir, packagePath ) {
	const nodeModulesPath = path.join( currentDir, 'node_modules' );

	// Check if node_modules folder with package path exists in the current directory
	if ( fs.existsSync( path.join( nodeModulesPath, packagePath ) ) ) {
		return nodeModulesPath;
	}

	// Move up a directory and try again, unless we've reached the root directory
	const parentDir = path.resolve( currentDir, '..' );

	if ( parentDir === currentDir ) {
		// We've reached the root directory without finding node_modules
		return null;
	}

	// Recursively search in the parent directory
	return locateNodeModules( parentDir, packagePath );
}

/**
 * Returns an absolute path to the main file of the `@ckeditor/ckeditor5-theme-lark` package.
 *
 * The function does the same as what does `require.resolve()`. However, there is no option for mocking it in tests,
 * hence the value is obtained manually.
 *
 * @param {String} cwd
 * @return {String}
 */
export default function getThemePath( cwd ) {
	const packagePath = path.join(
		'@ckeditor',
		'ckeditor5-theme-lark'
	);
	const nodeModulesPath = locateNodeModules( cwd, packagePath );
	const packageJson = fs.readJsonSync( path.join( nodeModulesPath, packagePath, 'package.json' ) );

	return path.join( nodeModulesPath, packagePath, packageJson.main );
}

/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

const path = require( 'path' );
const getPackageVersion = require( './get-package-version' );

/**
 * Returns an object containing version for packages listed below:
 *
 *   * ckeditor5
 *   * @ckeditor/ckeditor5-dev-utils (as `devUtils`)
 *   * eslint-config-ckeditor5 (as `eslintConfigCkeditor5`)
 *   * stylelint-config-ckeditor5 (as `eslintConfigCkeditor5`)
 *   * @ckeditor/ckeditor5-package-tools (as `stylelintConfigCkeditor5`)
 *
 * The value for the `packageTools` package depends on the `options.devMode` modifier:
 *
 *   * `true` - an absolute path to locally cloned package.
 *   * `false` - the latest version published on npm.
 *
 * Also, the `options.useNpm` modifier changes the protocol of the returned value:
 *
 *   * `true` - use the `file:` protocol.
 *   * `false` - use the `link:` protocol.
 *
 * @param {Boolean} devMode Whether current process is executed in the developer mode.
 * @param {Boolean} useNpm Whether to use `npm` when installing packages.
 * @returns {Object}
 */
module.exports = function getDependenciesVersions( { devMode, useNpm } ) {
	// `npm` does not understand the `link:` protocol. When installing packages from a file system,
	// it creates symlinks instead of copying the package files, while `yarn` does the opposite.
	// However, `yarn` supports the `link:` protocol, so let's use it.
	const protocol = useNpm ? 'file:' : 'link:';

	return {
		ckeditor5: getPackageVersion( 'ckeditor5' ),
		devUtils: getPackageVersion( '@ckeditor/ckeditor5-dev-utils' ),
		eslintConfigCkeditor5: getPackageVersion( 'eslint-config-ckeditor5' ),
		stylelintConfigCkeditor5: getPackageVersion( 'stylelint-config-ckeditor5' ),
		packageTools: devMode ?
			// Windows accepts unix-like paths in `package.json`, so let's unify it to avoid errors with paths.
			protocol + path.resolve( __dirname, '..', '..', '..', 'ckeditor5-package-tools' ).split( path.sep ).join( path.posix.sep ) :
			'^' + getPackageVersion( '@ckeditor/ckeditor5-package-tools' )
	};
};

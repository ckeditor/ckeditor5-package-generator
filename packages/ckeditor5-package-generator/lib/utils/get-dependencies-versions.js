/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const path = require( 'path' );
const getPackageVersion = require( './get-package-version' );

/**
 * Returns an object containing version for the packages listed below:
 *
 *   * ckeditor5
 *   * @ckeditor/ckeditor5-inspector (as `ckeditor5Inspector`)
 *   * eslint-config-ckeditor5 (as `eslintConfigCkeditor5`)
 *   * stylelint-config-ckeditor5 (as `stylelintConfigCkeditor5`)
 *   * @ckeditor/ckeditor5-package-tools (as `packageTools`)
 *
 * The value for the `packageTools` package depends on the `options.devMode` modifier:
 *
 *   * `true` - an absolute path to the locally cloned package.
 *   * `false` - the latest version published on npm.
 *
 * @param {Logger} logger
 * @param {CKeditor5PackageGeneratorOptions} options
 * @returns {Object}
 */
module.exports = function getDependenciesVersions( logger, options ) {
	logger.process( 'Collecting the latest CKEditor 5 packages versions...' );

	return {
		ckeditor5: getPackageVersion( 'ckeditor5' ),
		ckeditor5Inspector: getPackageVersion( '@ckeditor/ckeditor5-inspector' ),
		eslintConfigCkeditor5: getPackageVersion( 'eslint-config-ckeditor5' ),
		stylelintConfigCkeditor5: getPackageVersion( 'stylelint-config-ckeditor5' ),
		packageTools: options.dev ?
			// Windows accepts unix-like paths in `package.json`, so let's unify it to avoid errors with paths.
			'file:' + path.resolve( __dirname, '..', '..', '..', 'ckeditor5-package-tools' ).split( path.sep ).join( path.posix.sep ) :
			'^' + getPackageVersion( '@ckeditor/ckeditor5-package-tools' )
	};
};

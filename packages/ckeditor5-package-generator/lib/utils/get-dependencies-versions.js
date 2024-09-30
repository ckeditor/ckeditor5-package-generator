/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
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
 *   * @ckeditor/ckeditor5-dev-build-tools (as `ckeditor5DevBuildTools`)
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
 * @param {Boolean} dev
 * @returns {Object}
 */
module.exports = function getDependenciesVersions( logger, dev ) {
	logger.process( 'Collecting the latest CKEditor 5 packages versions...' );

	// Due to the release of breaking changes in the `@ckeditor/ckeditor5-dev-*` packages, package generator must lock
	// a version of the `@ckeditor/ckeditor5-dev-build-tools` package to the last compatible version: ^43.0.0.
	// Package generator will be able to use latest stable version of the `@ckeditor/ckeditor5-dev-build-tools` when
	// all blockers specified in https://github.com/ckeditor/ckeditor5-package-generator/issues/192 are resolved.
	const ckeditor5DevBuildToolsVersion = '43.0.0';

	return {
		ckeditor5: getPackageVersion( 'ckeditor5' ),
		ckeditor5PremiumFeatures: getPackageVersion( 'ckeditor5-premium-features' ),
		ckeditor5Inspector: getPackageVersion( '@ckeditor/ckeditor5-inspector' ),
		ckeditor5DevBuildTools: ckeditor5DevBuildToolsVersion,
		eslintConfigCkeditor5: getPackageVersion( 'eslint-config-ckeditor5' ),
		stylelintConfigCkeditor5: getPackageVersion( 'stylelint-config-ckeditor5' ),
		packageTools: dev ?
			// Windows accepts unix-like paths in `package.json`, so let's unify it to avoid errors with paths.
			'file:' + path.resolve( __dirname, '..', '..', '..', 'ckeditor5-package-tools' ).split( path.sep ).join( path.posix.sep ) :
			'^' + getPackageVersion( '@ckeditor/ckeditor5-package-tools' )
	};
};

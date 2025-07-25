/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import path from 'path';
import getPackageVersion from './get-package-version.js';

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
export default function getDependenciesVersions( logger, dev ) {
	logger.process( 'Collecting the latest CKEditor 5 packages versions...' );

	return {
		ckeditor5: getPackageVersion( 'ckeditor5' ),
		ckeditor5PremiumFeatures: getPackageVersion( 'ckeditor5-premium-features' ),
		ckeditor5Inspector: getPackageVersion( '@ckeditor/ckeditor5-inspector' ),
		ckeditor5DevBuildTools: getPackageVersion( '@ckeditor/ckeditor5-dev-build-tools' ),
		eslintConfigCkeditor5: getPackageVersion( 'eslint-config-ckeditor5' ),
		eslintPluginCkeditor5Rules: getPackageVersion( 'eslint-plugin-ckeditor5-rules' ),
		stylelintConfigCkeditor5: getPackageVersion( 'stylelint-config-ckeditor5' ),
		packageTools: dev ?
			// Windows accepts unix-like paths in `package.json`, so let's unify it to avoid errors with paths.
			// eslint-disable-next-line @stylistic/max-len
			'file:' + path.resolve( import.meta.dirname, '..', '..', '..', 'ckeditor5-package-tools' ).split( path.sep ).join( path.posix.sep ) :
			'^' + getPackageVersion( '@ckeditor/ckeditor5-package-tools' )
	};
}

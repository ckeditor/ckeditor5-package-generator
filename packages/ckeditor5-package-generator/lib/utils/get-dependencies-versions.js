/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import upath from 'upath';
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
 * @param {Object} options
 * @param {Boolean} options.dev
 * @param {Boolean} [options.useReleaseDirectory=false]
 * @returns {Object}
 */
export default function getDependenciesVersions( logger, { dev, useReleaseDirectory = false } ) {
	logger.process( 'Collecting the latest CKEditor 5 packages versions...' );

	return {
		ckeditor5: getPackageVersion( 'ckeditor5' ),
		ckeditor5PremiumFeatures: getPackageVersion( 'ckeditor5-premium-features' ),
		ckeditor5Inspector: getPackageVersion( '@ckeditor/ckeditor5-inspector' ),
		ckeditor5DevBuildTools: getPackageVersion( '@ckeditor/ckeditor5-dev-build-tools' ),
		eslintConfigCkeditor5: getPackageVersion( 'eslint-config-ckeditor5' ),
		eslintPluginCkeditor5Rules: getPackageVersion( 'eslint-plugin-ckeditor5-rules' ),
		stylelintConfigCkeditor5: getPackageVersion( 'stylelint-config-ckeditor5' ),
		packageTools: resolvePackageToolsDependency( logger, { dev, useReleaseDirectory } )
	};
}

function resolvePackageToolsDependency( logger, { dev, useReleaseDirectory } ) {
	if ( !dev ) {
		return '^' + getPackageVersion( '@ckeditor/ckeditor5-package-tools' );
	}

	// Controls how `ckeditor5-package-tools` is linked:
	// - `useReleaseDirectory=true` → `/root/release/ckeditor5-package-tools`
	// - `useReleaseDirectory=false` → `/root/packages/ckeditor5-package-tools`
	//
	// The repository defaults to `pnpm`, whose dependency layout is not fully compatible with Yarn.
	// To avoid traversing `node_modules/` (which may contain symlinks), enabling `useReleaseDirectory`
	// ensures a clean package structure without external modules.
	//
	// See: https://github.com/ckeditor/ckeditor5-package-generator/issues/253.
	const packageToolsPath = [
		import.meta.dirname,
		'..',
		'..',
		'..'
	];

	if ( useReleaseDirectory ) {
		logger.verboseInfo( 'Using the `release/` directory for `ckeditor5-package-tools`. Ensure it exists and is up-to-date.' );

		packageToolsPath.push( '..' );
		packageToolsPath.push( 'release' );
	}

	packageToolsPath.push( 'ckeditor5-package-tools' );

	// Windows accepts unix-like paths in `package.json`.
	return 'file:' + upath.resolve( ...packageToolsPath );
}

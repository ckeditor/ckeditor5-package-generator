/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import getPackageVersion from './get-package-version.js';

/**
 * Returns an object containing version for the packages listed below:
 *
 *   * `ckeditor5`
 *   * `@ckeditor/ckeditor5-inspector` (as `ckeditor5Inspector`)
 *   * `@ckeditor/ckeditor5-dev-build-tools` (as `ckeditor5DevBuildTools`)
 *   * `@ckeditor/ckeditor5-dev-translations` (as `ckeditor5DevTranslations`)
 *   * `eslint-config-ckeditor5` (as `eslintConfigCkeditor5`)
 *   * `eslint-plugin-ckeditor5-rules` (as `eslintPluginCkeditor5Rules`)
 *   * `stylelint-config-ckeditor5` (as `stylelintConfigCkeditor5`)
 *
 * @param {Logger} logger
 * @returns {Promise<Object>}
 */
export default async function getDependenciesVersions( logger ) {
	logger.process( 'Collecting the latest CKEditor 5 packages versions...' );

	const [
		ckeditor5,
		ckeditor5Inspector,
		ckeditor5DevBuildTools,
		ckeditor5DevTranslations,
		eslintConfigCkeditor5,
		eslintPluginCkeditor5Rules,
		stylelintConfigCkeditor5
	] = await Promise.all( [
		getPackageVersion( 'ckeditor5' ),
		getPackageVersion( '@ckeditor/ckeditor5-inspector' ),
		getPackageVersion( '@ckeditor/ckeditor5-dev-build-tools' ),
		getPackageVersion( '@ckeditor/ckeditor5-dev-translations' ),
		getPackageVersion( 'eslint-config-ckeditor5' ),
		getPackageVersion( 'eslint-plugin-ckeditor5-rules' ),
		getPackageVersion( 'stylelint-config-ckeditor5' )
	] );

	return {
		ckeditor5,
		ckeditor5Inspector,
		ckeditor5DevBuildTools,
		ckeditor5DevTranslations,
		eslintConfigCkeditor5,
		eslintPluginCkeditor5Rules,
		stylelintConfigCkeditor5
	};
}

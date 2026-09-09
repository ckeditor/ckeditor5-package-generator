/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import getPackageVersion from './get-package-version.js';

// These pins are temporary. They keep the generated packages on the major lines that the templates
// support now. Thus the generator does not install a future major release. Remove the pins after
// the templates support the next major line.
// See https://github.com/ckeditor/ckeditor5-internal/issues/4704.
const CKEDITOR5_DEV_VERSION_RANGE = '^61.0.0';
const LINTERS_VERSION_RANGE = '^20.0.0';

/**
 * Returns an object containing version for the packages listed below:
 *
 *   * `ckeditor5`
 *   * `@ckeditor/ckeditor5-inspector` (as `ckeditor5Inspector`)
 *   * `@ckeditor/ckeditor5-dev-build-tools` (as `ckeditor5DevBuildTools`)
 *   * `@ckeditor/ckeditor5-dev-translations` (as `ckeditor5DevTranslations`)
 *   * `eslint-config-ckeditor5` (as `eslintConfigCkeditor5`)
 *   * `eslint-plugin-ckeditor5-rules` (as `eslintPluginCkeditor5Rules`)
 *
 * @returns {Promise<Object>}
 */
export default async function getDependenciesVersions() {
	const [
		ckeditor5,
		ckeditor5Inspector,
		ckeditor5DevBuildTools,
		ckeditor5DevTranslations,
		eslintConfigCkeditor5,
		eslintPluginCkeditor5Rules
	] = await Promise.all( [
		getPackageVersion( 'ckeditor5' ),
		getPackageVersion( '@ckeditor/ckeditor5-inspector' ),
		getPackageVersion( '@ckeditor/ckeditor5-dev-build-tools', CKEDITOR5_DEV_VERSION_RANGE ),
		getPackageVersion( '@ckeditor/ckeditor5-dev-translations', CKEDITOR5_DEV_VERSION_RANGE ),
		getPackageVersion( 'eslint-config-ckeditor5', LINTERS_VERSION_RANGE ),
		getPackageVersion( 'eslint-plugin-ckeditor5-rules', LINTERS_VERSION_RANGE )
	] );

	return {
		ckeditor5,
		ckeditor5Inspector,
		ckeditor5DevBuildTools,
		ckeditor5DevTranslations,
		eslintConfigCkeditor5,
		eslintPluginCkeditor5Rules
	};
}

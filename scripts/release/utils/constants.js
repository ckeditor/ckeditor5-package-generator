/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

const upath = require( 'upath' );

module.exports = {
	PACKAGES_DIRECTORY: 'packages',
	RELEASE_DIRECTORY: 'release',
	PACKAGE_GENERATOR_ROOT: upath.join( __dirname, '..', '..', '..' )
};

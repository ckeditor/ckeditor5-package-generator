#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

const { execSync } = require( 'child_process' );

/**
* @param packageName
* @return {String}
*/
module.exports = function getLatestVersionOfPackage( packageName ) {
	return execSync( `npm view ${ packageName } version` ).toString().trim();
};

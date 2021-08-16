/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

const { InvalidArgumentError } = require( 'commander' );

const validators = {
	validateCKEditor5PackageName( value ) {
		if ( !value.match( /^ckeditor5-|-ckeditor5$/ ) ) {
			throw new InvalidArgumentError( 'The package name must starts with "ckeditor5-" prefix or ends with the "-ckeditor5" suffix.' );
		}

		return value;
	}
};

module.exports = validators;

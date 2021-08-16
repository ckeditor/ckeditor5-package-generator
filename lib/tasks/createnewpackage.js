/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

module.exports = class CreateNewPackage {
	constructor( options ) {
		this.options = options;
	}

	execute( packageName ) {
		console.log( 'Creating', packageName );
		console.log( 'Options', this.options );
	}
};

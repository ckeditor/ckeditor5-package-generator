#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

require( '@ckeditor/ckeditor5-dev-env' )
	.generateChangelogForMonoRepository( {
		cwd: process.cwd(),
		packages: 'packages',
		releaseBranch: 'i/17',
		// TODO: To remove after the initial release.
		from: '11aac066c2cd145528632b0fbc508f661e7d6e57',
		transformScope: name => {
			if ( name === 'create-ckeditor5-plugin' ) {
				return 'https://www.npmjs.com/package/create-ckeditor5-plugin';
			}

			return 'https://www.npmjs.com/package/@ckeditor/ckeditor5-' + name;
		}
	} );

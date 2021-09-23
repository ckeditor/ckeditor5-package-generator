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
		transformScope: name => {
			if ( name === 'create-ckeditor5-plugin' ) {
				return 'https://www.npmjs.com/package/create-ckeditor5-plugin';
			}

			return 'https://www.npmjs.com/package/@ckeditor/ckeditor5-' + name;
		}
	} );

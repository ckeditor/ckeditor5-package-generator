#!/usr/bin/env node

/**
 * @license Copyright (c) 2020-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

require( '@ckeditor/ckeditor5-dev-env' )
	.generateChangelogForMonoRepository( {
		cwd: process.cwd(),
		packages: 'packages',
		transformScope: name => {
			if ( name === 'generator' ) {
				return 'https://www.npmjs.com/package/ckeditor5-package-generator';
			}

			return 'https://www.npmjs.com/package/@ckeditor/ckeditor5-package-' + name;
		}
	} );

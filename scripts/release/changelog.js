#!/usr/bin/env node

/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

require( '@ckeditor/ckeditor5-dev-release-tools' )
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

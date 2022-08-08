/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const path = require( 'path' );
const fs = require( 'fs' );

module.exports = async options => {
	const lang = options._[ 0 ];

	const pkgJsonPath = path.join( options.cwd, 'package.json' );

	const oldPkgJsonRaw = fs.readFileSync( pkgJsonPath, 'utf-8' );
	const pkgJsonContent = JSON.parse( oldPkgJsonRaw );

	pkgJsonContent.main = `src/index.${ lang }`;
	const newPkgJsonRaw = JSON.stringify( pkgJsonContent, null, 2 ) + '\n';

	fs.writeFileSync( pkgJsonPath, newPkgJsonRaw, 'utf-8' );
};

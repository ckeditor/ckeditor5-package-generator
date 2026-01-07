/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import upath from 'upath';
import { tools } from '@ckeditor/ckeditor5-dev-utils';

export default ( options, lang ) => {
	const pkgJsonPath = upath.join( options.cwd, 'package.json' );

	tools.updateJSONFile( pkgJsonPath, json => {
		json.main = json.main.replace( /(?<=\.)[tj]s$/, lang );

		return json;
	} );
};

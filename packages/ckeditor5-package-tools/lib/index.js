/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import start from './tasks/start.js';
import dllBuild from './tasks/dll-build.js';
import synchronizeTranslations from './tasks/synchronize-translations.js';
import exportPackageAsJavaScript from './tasks/export-package-as-javascript.js';
import exportPackageAsTypeScript from './tasks/export-package-as-typescript.js';

export default {
	start( options ) {
		return start( options );
	},

	'dll:build'( options ) {
		return dllBuild( options );
	},

	'translations:synchronize'( options ) {
		return synchronizeTranslations( options );
	},

	'export-package-as-javascript'( options ) {
		return exportPackageAsJavaScript( options );
	},

	'export-package-as-typescript'( options ) {
		return exportPackageAsTypeScript( options );
	}
};

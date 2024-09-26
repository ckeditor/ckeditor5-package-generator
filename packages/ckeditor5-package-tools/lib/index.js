/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import start from './tasks/start.js';
import dllBuild from './tasks/dll-build.js';
import translationsCollect from './tasks/translations-collect.js';
import translationsUpload from './tasks/translations-upload.js';
import translationsDownload from './tasks/translations-download.js';
import exportPackageAsJavaScript from './tasks/export-package-as-javascript.js';
import exportPackageAsTypeScript from './tasks/export-package-as-typescript.js';

export default {
	start( options ) {
		return start( options );
	},

	'dll:build'( options ) {
		return dllBuild( options );
	},

	'translations:collect'( options ) {
		return translationsCollect( options );
	},

	'translations:upload'( options ) {
		return translationsUpload( options );
	},

	'translations:download'( options ) {
		return translationsDownload( options );
	},

	'export-package-as-javascript'( options ) {
		return exportPackageAsJavaScript( options );
	},

	'export-package-as-typescript'( options ) {
		return exportPackageAsTypeScript( options );
	}
};

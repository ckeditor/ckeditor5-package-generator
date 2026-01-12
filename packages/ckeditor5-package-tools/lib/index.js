/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import start from './tasks/start.js';
import synchronizeTranslations from './tasks/synchronize-translations.js';

export default {
	start( options ) {
		return start( options );
	},

	'translations:synchronize'( options ) {
		return synchronizeTranslations( options );
	}
};

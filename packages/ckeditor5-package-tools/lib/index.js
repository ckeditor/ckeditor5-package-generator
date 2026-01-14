/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import synchronizeTranslations from './tasks/synchronize-translations.js';

export default {
	'translations:synchronize'( options ) {
		return synchronizeTranslations( options );
	}
};

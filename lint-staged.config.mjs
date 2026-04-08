/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

export default {
	'**/*': files => {
		const filtered = files.filter( f => !f.includes( '/templates/' ) );

		if ( !filtered.length ) {
			return [];
		}

		const escaped = filtered.map( file => `"${ file.replaceAll( '"', '\\"' ) }"` );

		return [ `eslint --quiet ${ escaped.join( ' ' ) }` ];
	}
};

/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const PARTS_REGEXP = /[0-9]+|[A-Za-z][a-z]*/g;

/**
 * This function verifies the provided package name. If it is not valid, it logs a message and exits the process.
 * If it is valid, returns an object with the name in the following formats:
 *
 *   fullScoped: @scope/ckeditor5-super-feature-name
 *   pascalCase: SuperFeatureName
 *    camelCase: superFeatureName
 *    kebabCase: super-feature-name
 *    lowerCase: superfeaturename
 *    spacedOut: Super feature name
 *
 * @param {String} fullPackageName
 * @param {CKeditor5PackageGeneratorOptions} options
 * @returns {PackageName}
 */
module.exports = function getPackageName( fullPackageName, options ) {
	let parts;

	if ( options.name ) {
		parts = options.name.match( PARTS_REGEXP ).map( part => part.toLowerCase() );
	} else {
		parts = fullPackageName.split( 'ckeditor5-' )[ 1 ].match( PARTS_REGEXP );
	}

	return {
		fullScoped: fullPackageName,
		pascalCase: toPascalCase( parts ),
		camelCase: toCamelCase( parts ),
		kebabCase: parts.join( '-' ),
		lowerCase: parts.join( '' ),
		spacedOut: toSpacedOut( parts )
	};
};

/**
 * @param {Array<String>} parts
 * @returns {String}
 */
function toPascalCase( parts ) {
	return parts.map( uppercaseFirstChar ).join( '' );
}

/**
 * @param {Array<String>} parts
 * @returns {String}
 */
function toCamelCase( parts ) {
	const pascalCase = toPascalCase( parts );
	return pascalCase.charAt( 0 ).toLowerCase() + pascalCase.slice( 1 );
}

/**
 * @param {Array<String>} parts
 * @returns {String}
 */
function toSpacedOut( parts ) {
	return uppercaseFirstChar( parts.join( ' ' ) );
}

/**
 * @param {String} string
 * @returns {String}
 */
function uppercaseFirstChar( string ) {
	return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
}

/**
 * @typedef {Object} PackageName
 *
 * @property {String} fullScoped @scope/ckeditor5-super-feature-name
 *
 * @property {String} pascalCase SuperFeatureName
 *
 * @property {String} camelCase superFeatureName
 *
 * @property {String} kebabCase super-feature-name
 *
 * @property {String} lowerCase superfeaturename
 *
 * @property {String} spacedOut Super feature name
 */

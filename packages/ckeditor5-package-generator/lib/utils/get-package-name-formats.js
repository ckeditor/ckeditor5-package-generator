/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const PARTS_REGEXP = /[0-9]+|[A-Za-z][a-z]*/g;

/**
 * This function returns an object with the name package name in the following formats:
 *
 *   fullScoped: @scope/ckeditor5-super-feature-name
 *  featureName: super-feature-name
 *   pascalCase: SuperFeatureName
 *    camelCase: superFeatureName
 *    kebabCase: super-feature-name
 *    lowerCase: superfeaturename
 *    spacedOut: Super feature name
 *
 * Or with custom plugin name added via `--plugin-name` option:
 *
 *   fullScoped: @scope/ckeditor5-super-feature-name
 *  featureName: super-feature-name
 *   pascalCase: SuperPluginName
 *    camelCase: superPluginName
 *    kebabCase: super-plugin-name
 *    lowerCase: superpluginname
 *    spacedOut: Super plugin name
 *
 * @param {String} packageName
 * @param {String|undefined} pluginName
 * @returns {PackageNameFormats}
 */
module.exports = function getPackageNameFormats( packageName, pluginName ) {
	let parts;

	const featureName = packageName.split( 'ckeditor5-' )[ 1 ];

	if ( pluginName ) {
		parts = pluginName.match( PARTS_REGEXP ).map( part => part.toLowerCase() );
	} else {
		parts = featureName.match( PARTS_REGEXP );
	}

	return {
		fullScoped: packageName,
		featureName,
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
 * @typedef {Object} PackageNameFormats
 *
 * @property {String} fullScoped @scope/ckeditor5-super-feature-name
 *
 * @property {String} featureName: super-feature-name
 *
 * @property {String} pascalCase SuperPluginName
 *
 * @property {String} camelCase superPluginName
 *
 * @property {String} kebabCase super-plugin-name
 *
 * @property {String} lowerCase superpluginname
 *
 * @property {String} spacedOut Super plugin name
 */

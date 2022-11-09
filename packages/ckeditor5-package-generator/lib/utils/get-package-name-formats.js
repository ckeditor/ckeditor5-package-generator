/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const PARTS_REGEXP = /[0-9]+|[A-Za-z][a-z]*/g;

/**
 * This function returns an object with two properties: "package" and "plugin". Values of those properties
 * are object that contain the names formatted in different formats. If "pluginName" was not provided,
 * values for "plugin" will be the same as the "package" ones.
 *
 * @param {String} packageName
 * @param {String|undefined} pluginName
 * @returns {FormattedNames}
 */
module.exports = function getPackageNameFormats( packageName, pluginName ) {
	return {
		package: format( packageName ),
		plugin: format( pluginName || packageName )
	};
};

/**
 * @param {String} name
 * @returns {FormattedName}
 */
function format( name ) {
	// Removing the scope and prefix in case of the package name.
	const raw = name.split( 'ckeditor5-' ).pop();

	// Separating the name into its components.
	const parts = raw.match( PARTS_REGEXP )
		// Unifying letter size in case of the plugin name.
		.map( part => part.toLowerCase() );

	return {
		raw,
		spacedOut: toSpacedOut( parts ),
		camelCase: toCamelCase( parts ),
		pascalCase: toPascalCase( parts ),
		lowerCaseMerged: parts.join( '' )
	};
}

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
 * @typedef {Object} FormattedNames
 *
 * @property {FormattedName} package
 *
 * @property {FormattedName} plugin
 */

/**
 * @typedef {Object} FormattedName
 *
 * @property {String} raw: super-feature-name
 *
 * @property {String} spacedOut Super plugin name
 *
 * @property {String} camelCase superPluginName
 *
 * @property {String} pascalCase SuperPluginName
 *
 * @property {String} lowerCaseMerged superpluginname
 */

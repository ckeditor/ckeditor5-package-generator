/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const webpack = require( 'webpack' );
const getWebpackConfigDll = require( '../utils/get-webpack-config-dll' );

module.exports = options => {
	const webpackConfig = getWebpackConfigDll( options );

	return runWebpack( webpackConfig );
};

/**
 * @param {Object} webpackConfig
 * @returns {Promise}
 */
function runWebpack( webpackConfig ) {
	return new Promise( ( resolve, reject ) => {
		webpack( webpackConfig, ( err, stats ) => {
			if ( err ) {
				reject( err );
			} else if ( stats.hasErrors() ) {
				reject( new Error( stats.toString() ) );
			} else {
				// Display the compilation results.
				console.log( stats.toString() );

				resolve();
			}
		} );
	} );
}

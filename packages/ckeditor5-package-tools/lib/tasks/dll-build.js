/**
 * @license Copyright (c) 2020-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import webpack from 'webpack';
import getWebpackConfigDll from '../utils/get-webpack-config-dll.js';

export default options => {
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

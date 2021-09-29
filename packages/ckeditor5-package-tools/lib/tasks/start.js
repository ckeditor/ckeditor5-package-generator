/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const webpack = require( 'webpack' );
const WebpackDevServer = require( 'webpack-dev-server' );

const getWebpackConfigServer = require( '../utils/get-webpack-config-server' );

module.exports = options => {
	const webpackConfig = getWebpackConfigServer( options );
	const compiler = webpack( webpackConfig );
	const serverOptions = {
		...webpackConfig.devServer,
		open: options.open
	};

	const server = new WebpackDevServer( serverOptions, compiler );

	server.start();
};

/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
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
		open: true
	};

	const server = new WebpackDevServer( serverOptions, compiler );

	server.start();
};

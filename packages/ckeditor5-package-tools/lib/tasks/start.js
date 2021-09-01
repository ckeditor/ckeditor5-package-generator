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

	const server = new WebpackDevServer( compiler, {
		...webpackConfig.devServer
	} );

	server.listen( 9000, '127.0.0.1', () => {
		console.log( 'Starting server on http://localhost:9000' );
	} );
};

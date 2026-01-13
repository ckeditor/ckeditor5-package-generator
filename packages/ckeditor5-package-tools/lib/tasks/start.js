/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import getWebpackConfigServer from '../utils/get-webpack-config-server.js';

export default options => {
	const webpackConfig = getWebpackConfigServer( options );
	const compiler = webpack( webpackConfig );
	const serverOptions = {
		...webpackConfig.devServer,
		open: options.open
	};

	const server = new WebpackDevServer( serverOptions, compiler );

	server.start();
};

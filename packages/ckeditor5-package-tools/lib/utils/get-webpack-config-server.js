/**
 * @license Copyright (c) 2020-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

/* eslint-env node */

const path = require( 'path' );
const webpack = require( 'webpack' );
const { getPostCssConfig } = require( '@ckeditor/ckeditor5-dev-utils' ).styles;
const getThemePath = require( './get-theme-path' );

module.exports = options => {
	return {
		mode: options.production ? 'production' : 'development',

		performance: {
			hints: false
		},

		entry: path.join( options.cwd, 'sample', 'script.js' ),

		output: {
			filename: 'script.dist.js',
			path: path.join( options.cwd, 'sample' )
		},

		optimization: {
			minimize: false
		},

		devServer: {
			static: {
				directory: path.join( options.cwd, 'sample' )
			},
			compress: true
		},

		plugins: [
			new webpack.ProvidePlugin( {
				process: 'process/browser',
				Buffer: [ 'buffer', 'Buffer' ]
			} )
		],

		module: {
			rules: [
				{
					test: /\.svg$/,
					use: 'raw-loader'
				},
				{
					test: /\.css$/,
					use: [
						{
							loader: 'style-loader',
							options: {
								injectType: 'singletonStyleTag',
								attributes: {
									'data-cke': true
								}
							}
						},
						'css-loader',
						{
							loader: 'postcss-loader',
							options: {
								postcssOptions: getPostCssConfig( {
									themeImporter: {
										themePath: getThemePath( options.cwd )
									},
									minify: true
								} )
							}
						}
					]
				}
			]
		}
	};
};

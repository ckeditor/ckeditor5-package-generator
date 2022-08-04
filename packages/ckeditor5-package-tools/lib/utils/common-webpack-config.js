/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { getPostCssConfig } = require( '@ckeditor/ckeditor5-dev-utils' ).styles;
const getThemePath = require( './get-theme-path' );

/**
 * Returns "resolve" and "module" properties shared between webpack configs.
 *
 * @param {string} cwd
 * @returns {Object}
 */
module.exports = function commonWebpackConfig( cwd ) {
	return {
		resolve: {
		// Add support for TypeScript files and fallback to default extensions list.
			extensions: [ '.ts', '...' ]
		},

		module: {
			rules: [
				{
					test: /\.ts$/,
					use: 'ts-loader'
				},
				{
					test: /\.(svg|txt|html|rtf)$/,
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
										themePath: getThemePath( cwd )
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

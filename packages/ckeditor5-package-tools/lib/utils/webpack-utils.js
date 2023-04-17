/**
 * @license Copyright (c) 2020-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const path = require( 'path' );
const getThemePath = require( './get-theme-path' );
const { getPostCssConfig } = require( '@ckeditor/ckeditor5-dev-utils' ).styles;

module.exports = {
	loaderDefinitions: {
		raw: () => {
			return {
				test: /\.(svg|txt|html|rtf)$/,
				use: 'raw-loader'
			};
		},

		typescript: () => {
			return {
				test: /\.ts$/,
				use: 'ts-loader'
			};
		},

		coverage: cwd => {
			return {
				test: /\.[jt]s$/,
				loader: 'istanbul-instrumenter-loader',
				include: path.join( cwd, 'src' ),
				options: {
					esModules: true
				}
			};
		},

		styles: cwd => {
			return {
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
			};
		}
	},
	getModuleResolutionPaths: packageRootDir => {
		return [
			'node_modules',
			path.resolve( packageRootDir, 'node_modules' )
		];
	}
};

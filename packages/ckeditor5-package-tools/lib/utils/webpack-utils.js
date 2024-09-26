/**
 * @license Copyright (c) 2020-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import path from 'path';
import getThemePath from './get-theme-path.js';
import { styles } from '@ckeditor/ckeditor5-dev-utils';

export default {
	loaderDefinitions: {
		raw: () => {
			return {
				test: /\.(svg|txt|html|rtf)$/,
				loader: 'raw-loader'
			};
		},

		/**
		 * @param {String} cwd
		 * @param {String} [tsconfigName='tsconfig.json'] The TypeScript configuration that should be used
		 * by the `ts-loader` when processing TypeScript files.
		 * @returns {Object}
		 */
		typescript: ( cwd, tsconfigName = 'tsconfig.json' ) => {
			return {
				test: /\.ts$/,
				loader: 'ts-loader',
				options: {
					configFile: path.join( cwd, tsconfigName )
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
							postcssOptions: styles.getPostCssConfig( {
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

/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import upath from 'upath';
import { getThemePath } from './get-path.js';
import { styles } from '@ckeditor/ckeditor5-dev-utils';

export const loaderDefinitions = {
	raw: () => ( {
		test: /\.(svg|txt|html|rtf)$/,
		loader: 'raw-loader'
	} ),

	rawWithQuery: () => ( {
		resourceQuery: /raw/,
		loader: 'raw-loader'
	} ),

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
				configFile: upath.join( cwd, tsconfigName )
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
	},

	js: () => {
		return {
			// Allow extension-less ESM imports (e.g., `import x from './file'`)
			// by disabling fully specified resolution for `.js`/`.mjs` files.
			test: /\.m?js$/,
			resolve: {
				fullySpecified: false
			}
		};
	}
};

export function getModuleResolutionPaths( packageRootDir ) {
	return [
		'node_modules',
		upath.resolve( packageRootDir, 'node_modules' )
	];
}


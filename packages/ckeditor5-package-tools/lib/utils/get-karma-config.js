/**
 * @license Copyright (c) 2020-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

/* eslint-env node */

const path = require( 'path' );
const { loaderDefinitions } = require( './webpack-utils' );

/**
 * @param {Object} options
 * @returns {Object}
 */
module.exports = options => {
	const coverageDir = path.join( options.cwd, 'coverage' );

	const karmaConfig = {
		basePath: options.cwd,

		frameworks: [ 'mocha', 'sinon-chai', 'webpack' ],

		files: [ options.entryFile ],

		preprocessors: {
			[ options.entryFile ]: [ 'webpack' ]
		},

		webpack: getWebpackConfiguration( options ),

		webpackMiddleware: {
			noInfo: true,
			stats: 'minimal'
		},

		reporters: [ 'mocha' ],

		port: 9876,

		colors: true,

		logLevel: 'INFO',

		browsers: [
			process.env.CI === 'true' ? 'CHROME_TRAVIS_CI' : 'CHROME_LOCAL'
		],

		customLaunchers: {
			CHROME_TRAVIS_CI: {
				base: 'Chrome',
				flags: [ '--no-sandbox', '--disable-background-timer-throttling', '--js-flags="--expose-gc"' ]
			},
			CHROME_LOCAL: {
				base: 'Chrome',
				flags: [ '--disable-background-timer-throttling', '--js-flags="--expose-gc"', '--remote-debugging-port=9222' ]
			}
		},

		singleRun: true,

		concurrency: Infinity,

		browserNoActivityTimeout: 0,

		mochaReporter: {
			showDiff: true
		}
	};

	if ( options.sourceMap ) {
		karmaConfig.preprocessors[ options.entryFile ].push( 'sourcemap' );
	}

	if ( options.watch ) {
		karmaConfig.autoWatch = true;
		karmaConfig.singleRun = false;
	}

	if ( options.verbose ) {
		karmaConfig.webpackMiddleware.noInfo = false;
		delete karmaConfig.webpackMiddleware.stats;
	}

	if ( options.coverage ) {
		karmaConfig.reporters.push( 'coverage' );

		karmaConfig.coverageReporter = {
			reporters: [
				// Prints a table after tests result.
				{
					type: 'text-summary'
				},
				// Generates HTML tables with the results.
				{
					dir: coverageDir,
					type: 'html'
				},
				{
					dir: coverageDir,
					type: 'json'
				},
				// Generates "lcov.info" file. It's used by external code coverage services.
				{
					type: 'lcovonly',
					dir: coverageDir
				}
			],
			watermarks: {
				statements: [ 50, 100 ],
				functions: [ 50, 100 ],
				branches: [ 50, 100 ],
				lines: [ 50, 100 ]
			}
		};
	}

	return karmaConfig;
};

/**
 * @param {Object} options
 * @param {Boolean} [options.sourceMap=false]
 * @param {Boolean} [options.coverage=false]
 * @returns {Object}
 */
function getWebpackConfiguration( options ) {
	const config = {
		mode: 'development',

		resolve: {
			// Triple dots syntax allows extending default extension list instead of overwriting it.
			extensions: [ '.ts', '...' ]
		},

		module: {
			rules: [
				loaderDefinitions.raw(),
				loaderDefinitions.styles( options.cwd ),
				loaderDefinitions.typescript()
			]
		},

		resolveLoader: {
			modules: [
				'node_modules'
			]
		}
	};

	if ( options.sourceMap ) {
		// Available list: https://webpack.js.org/configuration/devtool/.
		config.devtool = 'eval-cheap-module-source-map';
	}

	if ( options.coverage ) {
		config.module.rules.unshift( loaderDefinitions.coverage( options.cwd ) );
	}

	return config;
}

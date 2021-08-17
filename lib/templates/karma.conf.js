'use strict';

const path = require( 'path' );
const { getPostCssConfig } = require( '@ckeditor/ckeditor5-dev-utils' ).styles;

const ROOT_DIRECTORY = __dirname;
const ENTRY_FILE_PATH = path.join( ROOT_DIRECTORY, 'tmp', 'tests-entry-point.js' );

/**
 * @param {Object} options
 * @returns {Object}
 */
module.exports = config => {
	const coverageDir = path.join( ROOT_DIRECTORY, 'coverage' );
	const options = {
		coverage: process.argv.includes( '--coverage' ),
		sourceMap: process.argv.includes( '--source-map' ),
		verbose: process.argv.includes( '--verbose' ),
		watch: process.argv.includes( '--watch' )
	};

	const karmaConfig = {
		basePath: ROOT_DIRECTORY,

		frameworks: [ 'mocha', 'sinon-chai' ],

		files: [ ENTRY_FILE_PATH, ],

		preprocessors: {
			[ ENTRY_FILE_PATH ]: [ 'webpack' ]
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
			process.env.CI ? 'CHROME_TRAVIS_CI' : 'CHROME_LOCAL'
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
		karmaConfig.preprocessors[ ENTRY_FILE_PATH ].push( 'sourcemap' );
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

	config.set( karmaConfig );
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

		module: {
			rules: [
				{
					test: /\.svg$/,
					use: [ 'raw-loader' ]
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
										themePath: require.resolve( '@ckeditor/ckeditor5-theme-lark' )
									},
									minify: true
								} )
							}
						}
					]
				},
				{
					test: /\.(txt|html|rtf)$/,
					use: [ 'raw-loader' ]
				}
			]
		},

		resolveLoader: {
			modules: [
				'node_modules',
			]
		}
	};

	if ( options.sourceMap ) {
		config.devtool = 'inline-source-map';
	}

	if ( options.coverage ) {
		config.module.rules.unshift(
			{
				test: /\.js$/,
				loader: 'istanbul-instrumenter-loader',
				include: path.join( ROOT_DIRECTORY, 'src' ),
				query: {
					esModules: true
				}
			}
		);
	}

	return config;
}

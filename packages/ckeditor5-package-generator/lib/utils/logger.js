/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

const chalk = require( 'chalk' );

module.exports = class Logger {
	/**
	 * @param {boolean} verbose
	 */
	constructor( verbose ) {
		this.verbose = verbose;
	}

	/**
	 * @param {string} message
	 * @param {Options} options
	 */
	process( message, options ) {
		this._genericLog( '📍 ' + message, options );
	}

	/**
	 * @param {string} message
	 * @param {Options} options
	 */
	info( message, options ) {
		this._genericLog( message, options );
	}

	/**
	 * @param {string} message
	 * @param {Options} options
	 */
	verboseInfo( message, options ) {
		if ( !this.verbose ) {
			return;
		}

		this._genericLog( message, options );
	}

	/**
	 * @param {string} message
	 * @param {Options} options
	 */
	error( message, options ) {
		this._genericLog( chalk.red( message ), options );
	}

	/**
	 * @param {string} message
	 * @param {Options} options
	 */
	_genericLog( message, options = {} ) {
		if ( options.startWithNewLine ) {
			console.log();
		}

		console.log( message );
	}
};

/**
 * @typedef {Object} Options
 *
 * @property {Boolean} [startWithNewLine]
 */

/**
 * @license Copyright (c) 2020-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const isInteractive = require( 'is-interactive' );
const cliSpinners = require( 'cli-spinners' );
const cliCursor = require( 'cli-cursor' );

/**
 * @param {String} title Description of the current processed task.
 * @param {Object} options
 * @param {Boolean} [options.isDisabled] Whether the spinner should be disabled.
 * @return {CKEditor5Spinner}
 */
module.exports = function createSpinner( title, options = {} ) {
	const isEnabled = !options.isDisabled && isInteractive();

	let timerId;

	return {
		start() {
			if ( !isEnabled ) {
				console.log( `📍 ${ title }` );
				return;
			}

			const frames = cliSpinners.dots12.frames;

			let index = 0;
			let shouldClearLastLine = false;

			cliCursor.hide();

			timerId = setInterval( () => {
				if ( index === frames.length ) {
					index = 0;
				}

				if ( shouldClearLastLine ) {
					clearLastLine();
				}

				process.stdout.write( `${ frames[ index++ ] } ${ title }` );
				shouldClearLastLine = true;
			}, cliSpinners.dots12.interval );
		},

		finish() {
			if ( !isEnabled ) {
				return;
			}

			clearInterval( timerId );
			clearLastLine();

			cliCursor.show();
			console.log( `📍 ${ title }` );
		}
	};

	function clearLastLine() {
		process.stdout.clearLine( 1 );
		process.stdout.cursorTo( 0 );
	}
};

/**
 * @typedef {Object} CKEditor5Spinner
 *
 * @property {Function} start
 *
 * @property {Function} finish
 */

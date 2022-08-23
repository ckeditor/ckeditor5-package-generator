/**
 * @license Copyright (c) 2020-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const updateEntryPoint = require( '../utils/update-entry-point' );

module.exports = options => updateEntryPoint( options, 'js' );

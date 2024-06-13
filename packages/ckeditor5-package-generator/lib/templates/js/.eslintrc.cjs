/* eslint-env node */

'use strict';

module.exports = {
	extends: 'ckeditor5',
	root: true,
	ignorePatterns: [
		// Ignore the entire `dist/`.
		'dist/**'
	],
	overrides: [
		{
			files: [ 'tests/**/*.js', 'sample/**/*.js' ],
			rules: {
				// Imports CKEditor 5 packages in test files are not checked.
				'ckeditor5-rules/ckeditor-imports': 'off'
			}
		}
	]
};

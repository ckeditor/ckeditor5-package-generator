/* eslint-env node */

'use strict';

module.exports = {
	extends: 'ckeditor5',
	root: true,
	ignorePatterns: [
		// Ignore the entire `dist/`.
		'dist/**'
	],
	rules: {
		'ckeditor5-rules/allow-imports-only-from-main-package-entry-point': 'error',
		'ckeditor5-rules/require-file-extensions-in-imports': [
			'error',
			{
				extensions: [ '.ts', '.js', '.json' ]
			}
		]
	},
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

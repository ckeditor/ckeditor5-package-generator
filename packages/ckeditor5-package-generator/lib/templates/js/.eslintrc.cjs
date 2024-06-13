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
		//  This rule disallows importing from any path other than the package main entrypoint.
		'ckeditor5-rules/allow-imports-only-from-main-package-entry-point': 'error',
		// As required by the ECMAScript (ESM) standard, all imports must include a file extension.
		// If the import does not include it, this rule will try to automatically detect the correct file extension.
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

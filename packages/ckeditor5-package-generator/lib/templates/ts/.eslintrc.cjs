/* eslint-env node */

'use strict';

module.exports = {
	extends: 'ckeditor5',
	parser: '@typescript-eslint/parser',
	plugins: [
		'@typescript-eslint'
	],
	root: true,
	ignorePatterns: [
		// Ignore the entire `dist/` (the NIM build).
		'dist/**',
		// Ignore compiled JavaScript files, as they are generated automatically.
		'src/**/*.js',
		// Also, do not check typing declarations, too.
		'src/**/*.d.ts'
	],
	overrides: [
		{
			files: [ 'tests/**/*.[jt]s', 'sample/**/*.[jt]s' ],
			rules: {
				// To write complex tests, you may need to import files that are not exported in DLL files by default.
				// Hence, imports CKEditor 5 packages in test files are not checked.
				'ckeditor5-rules/ckeditor-imports': 'off'
			}
		}
	]
};

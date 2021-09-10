/* eslint-env node */

'use strict';

const dllPackages = require( 'eslint-plugin-ckeditor5-rules' ).rules[ 'ckeditor-imports' ].meta.dllPackages;

module.exports = {
	extends: 'ckeditor5',
	settings: {
		// List of CKEditor 5 packages (without the "ckeditor5-" prefix) that are considered as
		// the core DLL packages. The list must be compatible with packages mentioned in the "Base DLL build" point.
		// See: https://ckeditor.com/docs/ckeditor5/latest/builds/guides/development/dll-builds.html#anatomy-of-a-dll-build.
		dllPackages
	},
	rules: {
		// This rule disallows importing core DLL packages directly. Imports should be done using the `ckeditor5` package.
		// Also, importing non-DLL packages is not allowed. If the plugin requires other features to work, they should be
		// specified as soft-requirements.
		// Read more: https://ckeditor.com/docs/ckeditor5/latest/builds/guides/migration/migration-to-26.html#soft-requirements.
		'ckeditor5-rules/ckeditor-imports': 'error'
	},
	overrides: [
		{
			files: [ 'tests/**/*.js', 'sample/**/*.js' ],
			rules: {
				// To write complex tests, you may need to import files that are not exported in DLL files by default.
				// Hence, imports CKEditor 5 packages in test files are not checked.
				'ckeditor5-rules/ckeditor-imports': 'off'
			}
		}
	]
};

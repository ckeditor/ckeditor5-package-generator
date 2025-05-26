import globals from 'globals';
import { defineConfig } from 'eslint/config';
import eslintConfigCKEditor5 from 'eslint-config-ckeditor5';
import eslintPluginCKEditor5Rules from 'eslint-plugin-ckeditor5-rules';

export default defineConfig( [
	eslintConfigCKEditor5,
	{
		name: 'Ignored files config',
		ignores: [
			// Ignore compiled JavaScript files, as they are generated automatically.
			'src/**/*.js',
			// Also, do not check typing declarations, too.
			'src/**/*.d.ts',
			// Ignore the entire `dist/`.
			'dist/**',
			// Ignore the entire `build/` (the DLL build).
			'build/**'
		]
	},
	{
		name: 'Base config',
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module'
		},
		linterOptions: {
			reportUnusedInlineConfigs: 'error',
			reportUnusedDisableDirectives: 'error'
		},
		plugins: {
			'ckeditor5-rules': eslintPluginCKEditor5Rules
		},
		rules: {
			//  This rule disallows importing from any path other than the package main entrypoint.
			'ckeditor5-rules/allow-imports-only-from-main-package-entry-point': 'error',
			// As required by the ECMAScript (ESM) standard, all imports must include a file extension.
			// If the import does not include it, this rule will try to automatically detect the correct file extension.
			'ckeditor5-rules/require-file-extensions-in-imports': [ 'error', {
				extensions: [ '.ts', '.js', '.json' ]
			} ],
			// This rule disallows importing core DLL packages directly. Imports should be done using the `ckeditor5` package.
			// Also, importing non-DLL packages is not allowed. If the package requires other features to work, they should be
			// specified as soft-requirements.
			// Read more: https://ckeditor.com/docs/ckeditor5/latest/builds/guides/migration/migration-to-26.html#soft-requirements.
			'ckeditor5-rules/ckeditor-imports': 'error'
		}
	},
	{
		name: 'NodeJS environment config',
		files: [
			'./scripts/**/*.{js,mjs,cjs}'
		],
		languageOptions: {
			globals: {
				...globals.node
			}
		}
	},
	{
		name: 'Browser environment config',
		files: [
			'./sample/**/*.{ts,mts,cts}',
			'./src/**/*.{ts,mts,cts}',
			'./tests/**/*.{ts,mts,cts}',
			'./typings/**/*.d.ts'
		],
		languageOptions: {
			globals: {
				...globals.browser
			}
		}
	},
	{
		name: 'Sample and tests config',
		files: [
			'sample/**/*.{ts,mts,cts}',
			'tests/**/*.{ts,mts,cts}'
		],
		rules: {
			// To write complex tests, you may need to import files that are not exported in DLL files by default.
			// Hence, imports CKEditor 5 packages in test files are not checked.
			'ckeditor5-rules/ckeditor-imports': 'off'
		}
	}
] );

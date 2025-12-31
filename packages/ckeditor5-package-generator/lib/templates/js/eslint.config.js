import globals from 'globals';
import { defineConfig } from 'eslint/config';
import eslintConfigCKEditor5 from 'eslint-config-ckeditor5';
import eslintPluginCKEditor5Rules from 'eslint-plugin-ckeditor5-rules';

export default defineConfig( [
	eslintConfigCKEditor5,
	{
		name: 'Ignored files config',
		ignores: [
			// Ignore the entire `dist/`.
			'dist/**'
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
			// This rule disallows importing from any path other than the package main entrypoint.
			'ckeditor5-rules/allow-imports-only-from-main-package-entry-point': 'error',
			// As required by the ECMAScript (ESM) standard, all imports must include a file extension.
			// If the import does not include it, this rule will try to automatically detect the correct file extension.
			'ckeditor5-rules/require-file-extensions-in-imports': [ 'error', {
				extensions: [ '.ts', '.js', '.json' ]
			} ]
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
			'./sample/**/*.{js,mjs,cjs}',
			'./src/**/*.{js,mjs,cjs}',
			'./tests/**/*.{js,mjs,cjs}'
		],
		languageOptions: {
			globals: {
				...globals.browser
			}
		}
	}
] );

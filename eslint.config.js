/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { readdirSync } from 'node:fs';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import eslintConfigCKEditor5 from 'eslint-config-ckeditor5';
import eslintPluginCKEditor5Rules from 'eslint-plugin-ckeditor5-rules';

const projectPackages = readdirSync( './packages', { withFileTypes: true } )
	.filter( dirent => dirent.isDirectory() )
	.map( dirent => dirent.name );

export default defineConfig( [
	eslintConfigCKEditor5,
	{
		name: 'Ignored files config',
		ignores: [
			'coverage/**',

			// Template files are generator payload rather than project source, so they are not linted here (they
			// are validated by the `verify-build` job, which generates a package from them and lints it). Ignoring
			// the whole directory also prevents ESLint from following the intentionally dangling `common/CLAUDE.md`
			// symlink, which only resolves in a generated package once the language-specific `AGENTS.md` sits next
			// to it.
			'packages/ckeditor5-package-generator/lib/templates/**'
		]
	},
	{
		name: 'Base config',
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.node
			}
		},
		linterOptions: {
			reportUnusedInlineConfigs: 'error',
			reportUnusedDisableDirectives: 'error'
		},
		plugins: {
			'ckeditor5-rules': eslintPluginCKEditor5Rules
		},
		files: [ '**/*.{js,cjs,mjs,ts}' ],
		rules: {
			'no-console': 'off',
			'ckeditor5-rules/license-header': [ 'error', { headerLines: [
				'/**',
				' * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md.',
				' */'
			] } ],
			'ckeditor5-rules/require-file-extensions-in-imports': [ 'error', {
				extensions: [ '.ts', '.js', '.json' ]
			} ]
		}
	},

	// Rules specific to changelog files.
	{
		extends: eslintConfigCKEditor5,

		files: [ '.changelog/**/*.md' ],

		plugins: {
			'ckeditor5-rules': eslintPluginCKEditor5Rules
		},

		rules: {
			'ckeditor5-rules/validate-changelog-entry': [ 'error', {
				allowedScopes: projectPackages,
				repositoryType: 'mono'
			} ]
		}
	}
] );

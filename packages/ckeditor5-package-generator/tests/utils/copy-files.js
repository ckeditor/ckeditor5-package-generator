/**
 * @license Copyright (c) 2020-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import { globSync } from 'glob';
import copyFiles from '../../lib/utils/copy-files.js';

vi.mock( 'chalk', () => ( {
	default: {
		gray: vi.fn()
	}
} ) );
vi.mock( 'fs' );
vi.mock( 'glob' );
vi.mock( 'mkdirp' );

describe( 'lib/utils/copy-files', () => {
	let options, stubs;

	const packageJson = {
		'name': '<%= packageName %>',
		'license': 'MIT',
		'dependencies': {
			'ckeditor5': '>=<%= packageVersions.ckeditor5 %>'
		},
		'devDependencies': {
			'@ckeditor/ckeditor5-autoformat': '>=<%= packageVersions.ckeditor5 %>',
			'@ckeditor/ckeditor5-basic-styles': '>=<%= packageVersions.ckeditor5 %>',
			'@ckeditor/ckeditor5-block-quote': '>=<%= packageVersions.ckeditor5 %>',
			'@ckeditor/ckeditor5-inspector': '>=<%= packageVersions.ckeditor5Inspector %>',
			'eslint': '^7.32.0',
			'eslint-config-ckeditor5': '>=<%= packageVersions.eslintConfigCkeditor5 %>',
			'stylelint': '^13.13.1',
			'stylelint-config-ckeditor5': '>=<%= packageVersions.stylelintConfigCkeditor5 %>'
		},
		'scripts': {
			'build:dist': 'node ./scripts/build-dist.mjs',
			'prepare': '<%= packageManager %> run build:dist'
		}
	};

	beforeEach( () => {
		vi.useFakeTimers( {
			now: new Date( 1984, 1, 1, 0, 0 ),
			shouldAdvanceTime: true,
			toFake: [ 'Date' ]
		} );

		vi.mocked( globSync ).mockImplementation( pattern => {
			if ( pattern === 'common/**/*' ) {
				return [ 'common/LICENSE.md', 'common/lang/contexts.json', 'common/pnpm-workspace.yaml' ];
			}

			if ( pattern === 'js/**/*' ) {
				return [ 'js/package.json', 'js/src/index.js' ];
			}

			if ( pattern === 'ts/**/*' ) {
				return [ 'ts/package.json', 'ts/src/index.ts' ];
			}
		} );

		vi.mocked( fs.readFileSync ).mockImplementation( path => {
			if ( path.endsWith( 'templates/common/pnpm-workspace.yaml' ) ) {
				return '# pnpm workspace file';
			}

			if ( path.endsWith( 'templates/common/LICENSE.md' ) ) {
				return 'Copyright (c) <%= now.getFullYear() %>. All rights reserved.\n';
			}

			if ( path.endsWith( 'templates/common/lang/contexts.json' ) ) {
				return JSON.stringify( {
					'My plugin': 'Content for a tooltip is displayed when a user hovers the CKEditor 5 icon.'
				}, null, 2 );
			}

			if ( path.endsWith( 'templates/js/package.json' ) ) {
				return JSON.stringify( packageJson, null, 2 );
			}

			if ( path.endsWith( 'templates/ts/package.json' ) ) {
				return JSON.stringify( packageJson, null, 2 );
			}

			if ( path.endsWith( 'templates/js/src/index.js' ) ) {
				return '/* JS CODE */';
			}

			if ( path.endsWith( 'templates/ts/src/index.ts' ) ) {
				return '/* TS CODE */';
			}

			if ( path.endsWith( 'templates/js/src/_PLACEHOLDER_.js' ) ) {
				return '/* PLACEHOLDER JS CODE */';
			}

			if ( path.endsWith( 'templates/js/src/foo.js.txt' ) ) {
				return '/* JS CODE IN TXT FILE */';
			}
		} );

		options = {
			packageName: '@foo/ckeditor5-featurename',
			programmingLanguage: 'js',
			formattedNames: {
				package: {
					raw: 'featurename',
					spacedOut: 'Featurename',
					camelCase: 'featurename',
					pascalCase: 'Featurename',
					lowerCaseMerged: 'featurename'
				},
				plugin: {
					raw: 'BarBaz',
					spacedOut: 'Bar baz',
					camelCase: 'barBaz',
					pascalCase: 'BarBaz',
					lowerCaseMerged: 'barbaz'
				}
			},
			packageManager: 'yarn',
			directoryPath: 'directory/path/foo',
			packageVersions: {
				ckeditor5: '30.0.0'
			}
		};

		stubs = {
			logger: {
				process: vi.fn(),
				verboseInfo: vi.fn()
			}
		};
	} );

	afterEach( () => {
		vi.useRealTimers();
	} );

	it( 'should be a function', () => {
		expect( copyFiles ).toBeTypeOf( 'function' );
	} );

	it( 'logs the process', () => {
		copyFiles( stubs.logger, options );

		expect( stubs.logger.process ).toHaveBeenCalledWith( 'Copying files...' );
	} );

	it( 'creates files for JavaScript', () => {
		copyFiles( stubs.logger, options );

		expect( fs.writeFileSync ).toHaveBeenCalledTimes( 4 );

		expect( fs.writeFileSync ).toHaveBeenNthCalledWith(
			1,
			'directory/path/foo/LICENSE.md',
			'Copyright (c) 1984. All rights reserved.\n'
		);

		expect( fs.writeFileSync ).toHaveBeenNthCalledWith(
			2,
			'directory/path/foo/lang/contexts.json',
			[
				'{',
				'  "My plugin": "Content for a tooltip is displayed when a user hovers the CKEditor 5 icon."',
				'}'
			].join( '\n' )
		);

		expect( fs.writeFileSync ).toHaveBeenNthCalledWith(
			3,
			'directory/path/foo/package.json',
			JSON.stringify( {
				'name': '@foo/ckeditor5-featurename',
				'license': 'MIT',
				'dependencies': {
					'ckeditor5': '>=30.0.0'
				},
				'devDependencies': {
					'@ckeditor/ckeditor5-autoformat': '>=30.0.0',
					'@ckeditor/ckeditor5-basic-styles': '>=30.0.0',
					'@ckeditor/ckeditor5-block-quote': '>=30.0.0',
					'@ckeditor/ckeditor5-inspector': '>=',
					'@ckeditor/ckeditor5-package-tools': '25.0.0',
					'eslint': '^7.32.0',
					'eslint-config-ckeditor5': '>=',
					'stylelint': '^13.13.1',
					'stylelint-config-ckeditor5': '>='
				},
				'scripts': {
					'build:dist': 'node ./scripts/build-dist.mjs',
					'prepare': 'yarn run build:dist'
				}
			}, null, 2 )
		);

		expect( fs.writeFileSync ).toHaveBeenNthCalledWith(
			4,
			'directory/path/foo/src/index.js',
			'/* JS CODE */'
		);
	} );

	it( 'creates files for TypeScript', () => {
		options.programmingLanguage = 'ts';

		copyFiles( stubs.logger, options );

		expect( fs.writeFileSync ).toHaveBeenCalledTimes( 4 );

		expect( fs.writeFileSync ).toHaveBeenNthCalledWith(
			1,
			'directory/path/foo/LICENSE.md',
			'Copyright (c) 1984. All rights reserved.\n'
		);

		expect( fs.writeFileSync ).toHaveBeenNthCalledWith(
			2,
			'directory/path/foo/lang/contexts.json',
			[
				'{',
				'  "My plugin": "Content for a tooltip is displayed when a user hovers the CKEditor 5 icon."',
				'}'
			].join( '\n' )
		);

		expect( fs.writeFileSync ).toHaveBeenNthCalledWith(
			3,
			'directory/path/foo/package.json',
			JSON.stringify( {
				'name': '@foo/ckeditor5-featurename',
				'license': 'MIT',
				'dependencies': {
					'ckeditor5': '>=30.0.0'
				},
				'devDependencies': {
					'@ckeditor/ckeditor5-autoformat': '>=30.0.0',
					'@ckeditor/ckeditor5-basic-styles': '>=30.0.0',
					'@ckeditor/ckeditor5-block-quote': '>=30.0.0',
					'@ckeditor/ckeditor5-inspector': '>=',
					'@ckeditor/ckeditor5-package-tools': '25.0.0',
					'eslint': '^7.32.0',
					'eslint-config-ckeditor5': '>=',
					'stylelint': '^13.13.1',
					'stylelint-config-ckeditor5': '>='
				},
				'scripts': {
					'build:dist': 'node ./scripts/build-dist.mjs',
					'prepare': 'yarn run build:dist'
				}
			}, null, 2 )
		);

		expect( fs.writeFileSync ).toHaveBeenNthCalledWith(
			4,
			'directory/path/foo/src/index.ts',
			'/* TS CODE */'
		);
	} );

	it( 'replaces placeholder filenames', () => {
		const globSyncMock = vi.mocked( globSync ).getMockImplementation();

		vi.mocked( globSync ).mockImplementation( pattern => {
			if ( pattern === 'js/**/*' ) {
				return [
					'js/package.json',
					'js/src/index.js',
					'js/src/_PLACEHOLDER_.js'
				];
			}

			return globSyncMock( pattern );
		} );

		copyFiles( stubs.logger, options );

		expect( fs.writeFileSync ).toHaveBeenCalledTimes( 5 );
		expect( fs.writeFileSync ).toHaveBeenNthCalledWith(
			5,
			'directory/path/foo/src/barbaz.js',
			'/* PLACEHOLDER JS CODE */'
		);
	} );

	it( 'removes ".txt" extension from filenames', () => {
		const globSyncMock = vi.mocked( globSync ).getMockImplementation();

		vi.mocked( globSync ).mockImplementation( pattern => {
			if ( pattern === 'js/**/*' ) {
				return [
					'js/package.json',
					'js/src/index.js',
					'js/src/foo.js.txt'
				];
			}

			return globSyncMock( pattern );
		} );

		copyFiles( stubs.logger, options );

		expect( fs.writeFileSync ).toHaveBeenCalledTimes( 5 );
		expect( fs.writeFileSync ).toHaveBeenNthCalledWith(
			5,
			'directory/path/foo/src/foo.js',
			'/* JS CODE IN TXT FILE */'
		);
	} );

	it( 'works correctly with path containing directory called "common"', () => {
		options.directoryPath = 'directory/common/foo';

		copyFiles( stubs.logger, options );

		expect( fs.writeFileSync ).toHaveBeenCalledTimes( 4 );

		expect( fs.writeFileSync ).toHaveBeenNthCalledWith(
			1,
			'directory/common/foo/LICENSE.md',
			expect.any( String )
		);

		expect( fs.writeFileSync ).toHaveBeenNthCalledWith(
			2,
			'directory/common/foo/lang/contexts.json',
			expect.any( String )
		);

		expect( fs.writeFileSync ).toHaveBeenNthCalledWith(
			3,
			'directory/common/foo/package.json',
			expect.any( String )
		);

		expect( fs.writeFileSync ).toHaveBeenNthCalledWith(
			4,
			'directory/common/foo/src/index.js',
			expect.any( String )
		);
	} );

	it( 'works correctly with path containing directory called "js"', () => {
		options.directoryPath = 'directory/js/foo';

		copyFiles( stubs.logger, options );

		expect( fs.writeFileSync ).toHaveBeenCalledTimes( 4 );

		expect( fs.writeFileSync ).toHaveBeenNthCalledWith(
			1,
			'directory/js/foo/LICENSE.md',
			expect.any( String )
		);

		expect( fs.writeFileSync ).toHaveBeenNthCalledWith(
			2,
			'directory/js/foo/lang/contexts.json',
			expect.any( String )
		);

		expect( fs.writeFileSync ).toHaveBeenNthCalledWith(
			3,
			'directory/js/foo/package.json',
			expect.any( String )
		);

		expect( fs.writeFileSync ).toHaveBeenNthCalledWith(
			4,
			'directory/js/foo/src/index.js',
			expect.any( String )
		);
	} );

	it( 'works correctly with path containing directory called "ts"', () => {
		options.directoryPath = 'directory/ts/foo';

		copyFiles( stubs.logger, options );

		expect( fs.writeFileSync ).toHaveBeenCalledTimes( 4 );

		expect( fs.writeFileSync ).toHaveBeenNthCalledWith(
			1,
			'directory/ts/foo/LICENSE.md',
			expect.any( String )
		);

		expect( fs.writeFileSync ).toHaveBeenNthCalledWith(
			2,
			'directory/ts/foo/lang/contexts.json',
			expect.any( String )
		);

		expect( fs.writeFileSync ).toHaveBeenNthCalledWith(
			3,
			'directory/ts/foo/package.json',
			expect.any( String )
		);

		expect( fs.writeFileSync ).toHaveBeenNthCalledWith(
			4,
			'directory/ts/foo/src/index.js',
			expect.any( String )
		);
	} );

	it( 'works correctly with path containing directory called "Projects" (it ends with "ts")', () => {
		options.directoryPath = 'directory/Projects/foo';

		copyFiles( stubs.logger, options );

		expect( fs.writeFileSync ).toHaveBeenCalledTimes( 4 );

		expect( fs.writeFileSync ).toHaveBeenNthCalledWith(
			1,
			'directory/Projects/foo/LICENSE.md',
			expect.any( String )
		);

		expect( fs.writeFileSync ).toHaveBeenNthCalledWith(
			2,
			'directory/Projects/foo/lang/contexts.json',
			expect.any( String )
		);

		expect( fs.writeFileSync ).toHaveBeenNthCalledWith(
			3,
			'directory/Projects/foo/package.json',
			expect.any( String )
		);

		expect( fs.writeFileSync ).toHaveBeenNthCalledWith(
			4,
			'directory/Projects/foo/src/index.js',
			expect.any( String )
		);
	} );

	it( 'works with npm instead of yarn', () => {
		options.packageManager = 'npm';

		copyFiles( stubs.logger, options );

		expect( fs.writeFileSync ).toHaveBeenCalledTimes( 4 );

		expect( fs.writeFileSync ).toHaveBeenNthCalledWith(
			1,
			'directory/path/foo/LICENSE.md',
			'Copyright (c) 1984. All rights reserved.\n'
		);

		expect( fs.writeFileSync ).toHaveBeenNthCalledWith(
			2,
			'directory/path/foo/lang/contexts.json',
			[
				'{',
				'  "My plugin": "Content for a tooltip is displayed when a user hovers the CKEditor 5 icon."',
				'}'
			].join( '\n' )
		);

		expect( fs.writeFileSync ).toHaveBeenNthCalledWith(
			3,
			'directory/path/foo/package.json',
			JSON.stringify( {
				'name': '@foo/ckeditor5-featurename',
				'license': 'MIT',
				'dependencies': {
					'ckeditor5': '>=30.0.0'
				},
				'devDependencies': {
					'@ckeditor/ckeditor5-autoformat': '>=30.0.0',
					'@ckeditor/ckeditor5-basic-styles': '>=30.0.0',
					'@ckeditor/ckeditor5-block-quote': '>=30.0.0',
					'@ckeditor/ckeditor5-inspector': '>=',
					'@ckeditor/ckeditor5-package-tools': '25.0.0',
					'eslint': '^7.32.0',
					'eslint-config-ckeditor5': '>=',
					'stylelint': '^13.13.1',
					'stylelint-config-ckeditor5': '>='
				},
				'scripts': {
					'build:dist': 'node ./scripts/build-dist.mjs',
					'prepare': 'npm run build:dist'
				}
			}, null, 2 )
		);

		expect( fs.writeFileSync ).toHaveBeenNthCalledWith(
			4,
			'directory/path/foo/src/index.js',
			'/* JS CODE */'
		);
	} );

	it( 'copies "pnpm-workspace.yaml" for pnpm', () => {
		options.packageManager = 'pnpm';

		copyFiles( stubs.logger, options );

		expect( fs.writeFileSync ).toHaveBeenCalledWith(
			expect.stringContaining( 'pnpm-workspace.yaml' ),
			expect.any( String )
		);
	} );

	it( 'does not copy "pnpm-workspace.yaml" for npm', () => {
		options.packageManager = 'npm';

		copyFiles( stubs.logger, options );

		expect( fs.writeFileSync ).not.toHaveBeenCalledWith(
			expect.stringContaining( 'pnpm-workspace.yaml' ),
			expect.any( String )
		);
	} );

	it( 'does not copy "pnpm-workspace.yaml" for yarn', () => {
		options.packageManager = 'yarn';

		copyFiles( stubs.logger, options );

		expect( fs.writeFileSync ).not.toHaveBeenCalledWith(
			expect.stringContaining( 'pnpm-workspace.yaml' ),
			expect.any( String )
		);
	} );
} );

import { <%= packageName.pascalCase %> as <%= packageName.pascalCase %>Dll, icons } from '../src';
import <%= packageName.pascalCase %> from '../src/<%= packageName.lowerCase %>';

import ckeditor from './../theme/icons/ckeditor.svg';

describe( 'CKEditor5 <%= packageName.pascalCase %> DLL', () => {
	it( 'exports <%= packageName.pascalCase %>', () => {
		expect( <%= packageName.pascalCase %>Dll ).to.equal( <%= packageName.pascalCase %> );
	} );

	describe( 'icons', () => {
		it( 'exports the "ckeditor" icon', () => {
			expect( icons.ckeditor ).to.equal( ckeditor );
		} );
	} );
} );

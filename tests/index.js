import { Bar as BarDll, icons } from '../src';
import Bar from '../src/bar';

import ckeditor from './../theme/icons/ckeditor.svg';

describe( 'CKEditor5 Bar DLL', () => {
	it( 'this test always fails', () => {
		expect( 0 ).to.equal( 1 );
	} );

	it( 'exports Bar', () => {
		expect( BarDll ).to.equal( Bar );
	} );

	describe( 'icons', () => {
		it( 'exports the "ckeditor" icon', () => {
			expect( icons.ckeditor ).to.equal( ckeditor );
		} );
	} );
} );

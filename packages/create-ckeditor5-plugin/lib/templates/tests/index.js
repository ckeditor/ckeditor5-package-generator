import { MyPlugin as MyPluginDll, icons } from '../src';
import MyPlugin from '../src/myplugin';

import ckeditor from './../theme/icons/ckeditor.svg';

describe( 'CKEditor5 MyPlugin DLL', () => {
	it( 'exports MyPlugin', () => {
		expect( MyPluginDll ).to.equal( MyPlugin );
	} );

	describe( 'icons', () => {
		it( 'exports the "ckeditor" icon', () => {
			expect( icons.ckeditor ).to.equal( ckeditor );
		} );
	} );
} );

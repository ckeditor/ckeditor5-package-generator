import { MyPlugin as MyPluginDll } from '../src';
import MyPlugin from '../src/myplugin';

describe( 'CKEditor5 MyPlugin DLL', () => {
	it( 'exports MyPlugin', () => {
		expect( MyPluginDll ).to.equal( MyPlugin );
	} );
} );

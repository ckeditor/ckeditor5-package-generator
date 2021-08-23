import { MyPlugin as MyPluginDll } from '../src/index';
import MyPlugin from '../src/myplugin';

describe( 'CKEditor5 MyPlugin DLL', () => {
	it( 'exports MyPlugin', () => {
		expect( MyPluginDll ).to.equal( MyPlugin );
	} );
} );

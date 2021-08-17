import MyPlugin from '../src/myplugin';

describe( 'MyPlugin', () => {
	it( 'should be named', () => {
		expect( MyPlugin.pluginName ).to.equal( 'MyPlugin' );
	} );
} );

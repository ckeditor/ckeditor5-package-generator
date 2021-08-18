import { Plugin } from 'ckeditor5/src/core';
import { ButtonView } from 'ckeditor5/src/ui';

import ckeditor5Icon from '../theme/icons/ckeditor.svg';

export default class MyPlugin extends Plugin {
	static get pluginName() {
		return 'MyPlugin'
	}

	init() {
		const editor = this.editor;
		const t = editor.t;
		const model = editor.model;

		// Add the "myPlugin" button to feature components.
		editor.ui.componentFactory.add( 'myPlugin', locale => {
			const view = new ButtonView( locale );

			view.set( {
				label: t( 'My plugin' ),
				icon: ckeditor5Icon,
				tooltip: true,
				isToggleable: true
			} );

			// Insert a text into the editor after clicking the button.
			this.listenTo( view, 'execute', () => {
				model.change( writer => {
					const root = model.document.getRoot();
					const paragraph = root.getChild( 0 );

					writer.insertText( 'Hello CKEditor 5!', paragraph, 0 );
				} );

				editor.editing.view.focus();
			} );

			return view;
		} );
	}
}

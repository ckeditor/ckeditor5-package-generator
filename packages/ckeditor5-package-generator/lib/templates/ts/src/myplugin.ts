import { Plugin } from 'ckeditor5/src/core';
import { ButtonView } from 'ckeditor5/src/ui';

import type { EditorWithUI } from 'ckeditor__ckeditor5-core/src/editor/editorwithui';

import ckeditor5Icon from '../theme/icons/ckeditor.svg';

export default class MyPlugin extends Plugin {
	public static override get pluginName(): string {
		return 'MyPlugin';
	}

	public override init(): void {
		const editor = this.editor as EditorWithUI;
		const t = editor.t;
		const model = editor.model;

		// Add the "myPlugin" button to feature components.
		editor.ui.componentFactory.add( 'myButton', locale => {
			const view = new ButtonView( locale );

			view.set( {
				label: t( 'My plugin' ),
				icon: ckeditor5Icon,
				tooltip: true
			} );

			// Insert a text into the editor after clicking the button.
			this.listenTo( view, 'execute', () => {
				model.change( writer => {
					const textNode = writer.createText( 'Hello CKEditor 5!' );

					model.insertContent( textNode );
				} );

				editor.editing.view.focus();
			} );

			return view;
		} );
	}
}

# CKEditor 5 Plugin Package

This is a CKEditor 5 plugin package generated using [ckeditor5-package-generator](https://ckeditor.com/docs/ckeditor5/latest/framework/develpment-tools/package-generator/using-package-generator.html). It contains a boilerplate example plugin (`<%= formattedNames.plugin.pascalCase %>`) and is set up for TypeScript, Vite, Vitest, and ESLint. When asked to implement specific functionality, **modify the existing plugin files** (`src/<%= formattedNames.plugin.lowerCaseMerged %>.ts`, `tests/<%= formattedNames.plugin.lowerCaseMerged %>.ts`, etc.) rather than creating a new plugin alongside it. The boilerplate plugin is a starting point to be replaced with real functionality.

## Commands

| Command | Purpose |
|---------|---------|
| `pnpm start` | Start Vite dev server — opens `sample/index.html` with the editor and CKEditor Inspector |
| `pnpm test` | Run Vitest tests in headless Chrome (browser mode). **100% coverage enforced on `src/`** |
| `pnpm lint` | Run ESLint |
| `pnpm stylelint` | Run Stylelint on `theme/**/*.css` |
| `pnpm build` | Full build: TypeScript declarations → ESM bundle → ESM+UMD browser bundle |
| `pnpm translations:synchronize` | Sync translation files from `lang/contexts.json` |

## Project Structure

```
src/
  index.ts — Package entry point. Re-exports all plugins, imports CSS and augmentation.
  <%= formattedNames.plugin.lowerCaseMerged %>.ts — Example plugin class (<%= formattedNames.plugin.pascalCase %>). Reference pattern for new plugins.
  augmentation.ts — TypeScript module augmentation. Adds plugins to PluginsMap for typed access.
tests/
  <%= formattedNames.plugin.lowerCaseMerged %>.ts — Vitest tests for the <%= formattedNames.plugin.pascalCase %> plugin.
sample/
  index.html — Dev page with editor content.
  index.ts — Dev editor setup with full plugin set + CKEditor Inspector.
theme/
  icons/ — SVG icons (imported as strings in plugin files).
  styles/index.css — Plugin CSS (side-effect imported in src/index.ts).
lang/
  contexts.json — Translation context descriptions (keys = translatable strings).
ckeditor5-metadata.json — Plugin metadata for tooling/integrators.
```

## Coding Conventions

**TypeScript.** All source is `.ts`. The CKEditor docs tutorials are in plain JS — adapt the patterns to TypeScript when following them.

**Import extensions.** Always use `.js` extension in import paths, even for `.ts` files. This is ESLint-enforced (`ckeditor5-rules/require-file-extensions-in-imports`).
```ts
// ✅ Correct
import Foo from './foo.js';
import type { Foo } from './index.js';

// ❌ Wrong — will fail lint
import Foo from './foo';
import Foo from './foo.ts';
```

**`import type` for type-only imports.** `verbatimModuleSyntax` is enabled in tsconfig — you must use `import type` when importing only types.
```ts
import type { Foo } from './index.js';        // ✅ type-only
import { Plugin, ButtonView } from 'ckeditor5'; // ✅ runtime values
```

**All CKEditor imports from `'ckeditor5'`.** Do NOT import from individual `@ckeditor/*` packages in plugin source. The one exception is the type augmentation file (`augmentation.ts`), which must `declare module '@ckeditor/ckeditor5-core'` to extend `PluginsMap`.

**Plugin class pattern.** Every plugin extends `Plugin` and has a static `pluginName` returning a string literal `as const`:
```ts
import { Plugin } from 'ckeditor5';

export default class MyFeature extends Plugin {
    public static get pluginName() {
        return 'MyFeature' as const;
    }

    public init(): void {
        // Plugin initialization: schema, converters, commands, UI
    }
}
```

**Editing / UI split (for complex features).** Split into `MyFeatureEditing` (schema, converters, commands) + `MyFeatureUI` (toolbar buttons, dropdowns) + a glue `MyFeature` plugin:
```ts
export default class MyFeature extends Plugin {
    public static get pluginName() { return 'MyFeature' as const; }
    public static get requires() { return [ MyFeatureEditing, MyFeatureUI ] as const; }
}
```

**Event listeners in plugins.** Use `this.listenTo( emitter, event, callback )` instead of `emitter.on()`. Listeners registered with `listenTo` are automatically removed when the plugin is destroyed; `on()` listeners leak.

**Translations.** Use `editor.t('Label')` for user-visible strings. Add the string as a key in `lang/contexts.json` with a description for translators.

## Key CKEditor 5 Patterns

### Schema
Define what's allowed in the editor model:
```ts
const schema = editor.model.schema;

// Inline attribute on text (like bold, highlight, abbreviation):
schema.extend( '$text', { allowAttributes: [ 'myAttribute' ] } );

// Block element (like a callout, info box):
schema.register( 'myBlock', {
    inheritAllFrom: '$block',       // behaves like a paragraph
    allowChildren: '$block'         // can contain other blocks (optional)
} );
```

### Conversion (model ↔ view)
```ts
const conversion = editor.conversion;

// Simple symmetric conversion (attribute ↔ element):
conversion.attributeToElement( { model: 'highlight', view: 'mark' } );

// Simple symmetric conversion (element ↔ element):
conversion.elementToElement( { model: 'myBlock', view: 'div' } );

// Separate upcast/downcast for asymmetric cases:
conversion.for( 'upcast' ).elementToAttribute( {
    view: { name: 'abbr', attributes: [ 'title' ] },
    model: {
        key: 'abbreviation',
        value: viewEl => viewEl.getAttribute( 'title' )
    }
} );
conversion.for( 'downcast' ).attributeToElement( {
    model: 'abbreviation',
    view: ( value, conversionApi ) => {
        return conversionApi.writer.createAttributeElement( 'abbr', { title: value } );
    }
} );
```

### Commands
```ts
import { Command } from 'ckeditor5';

class MyCommand extends Command {
    public override execute( options?: { value: string } ): void {
        const editor = this.editor;
        editor.model.change( writer => {
            // Modify the model...
        } );
    }

    public override refresh(): void {
        // Update this.isEnabled / this.value based on model state
    }
}

// Register in plugin init():
editor.commands.add( 'myCommand', new MyCommand( editor ) );
```

### UI — Toolbar Buttons
```ts
import { ButtonView } from 'ckeditor5';

editor.ui.componentFactory.add( 'myButton', locale => {
    const view = new ButtonView( locale );
    view.set( { label: t( 'My Button' ), icon: myIcon, tooltip: true } );

    this.listenTo( view, 'execute', () => {
        editor.execute( 'myCommand' );
        editor.editing.view.focus();
    } );

    return view;
} );
```

### Model Changes
Always modify the document model inside `editor.model.change()`:
```ts
editor.model.change( writer => {
    const text = writer.createText( 'Hello', { bold: true } );
    editor.model.insertContent( text );

    // Or set an attribute on selection:
    writer.setSelection( someRange );
    writer.setSelectionAttribute( 'myAttribute', 'value' );
} );
```

### Listening to Model/Document Events
```ts
// React to document changes (useful for live-updating widgets):
editor.model.document.on( 'change:data', () => {
    // The document content changed
} );

// React to selection changes:
editor.model.document.selection.on( 'change:range', () => {
    // Selection moved
} );
```

## Test Pattern

Tests use Vitest (browser mode) with Chai-style assertions. Each test creates a real `ClassicEditor`:
```ts
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { ClassicEditor, Essentials, Paragraph, Heading } from 'ckeditor5';
import MyPlugin from '../src/myplugin.js';

describe( 'MyPlugin', () => {
    let domElement: HTMLElement, editor: ClassicEditor;

    beforeEach( async () => {
        domElement = document.createElement( 'div' );
        document.body.appendChild( domElement );

        editor = await ClassicEditor.create( {
            attachTo: domElement,
            licenseKey: 'GPL',
            plugins: [ Paragraph, Heading, Essentials, MyPlugin ],
            toolbar: [ 'myButton' ]
        } );
    } );

    afterEach( () => {
        domElement.remove();
        return editor.destroy();
    } );

    it( 'should be named', () => {
        expect( MyPlugin.pluginName ).to.equal( 'MyPlugin' );
    } );

    it( 'should be loaded', () => {
        expect( editor.plugins.get( 'MyPlugin' ) ).to.be.an.instanceof( MyPlugin );
    } );
} );
```

## Documentation Links

### Crash Course (recommended reading order)
1. [Plugins](https://ckeditor.com/docs/ckeditor5/latest/framework/tutorials/crash-course/plugins.html) — what plugins are, registering a custom one
2. [Model and schema](https://ckeditor.com/docs/ckeditor5/latest/framework/tutorials/crash-course/model-and-schema.html) — model structure, schema rules
3. [Data conversion](https://ckeditor.com/docs/ckeditor5/latest/framework/tutorials/crash-course/data-conversion.html) — upcast, downcast, conversion helpers
4. [Commands](https://ckeditor.com/docs/ckeditor5/latest/framework/tutorials/crash-course/commands.html) — creating commands to modify the model
5. [UI](https://ckeditor.com/docs/ckeditor5/latest/framework/tutorials/crash-course/ui.html) — creating toolbar buttons and other UI components
6. [Events and keystrokes](https://ckeditor.com/docs/ckeditor5/latest/framework/tutorials/crash-course/events-and-keystrokes.html) — event system, keyboard shortcuts
7. [Plugin configuration](https://ckeditor.com/docs/ckeditor5/latest/framework/tutorials/crash-course/plugin-configuration.html) — making plugins configurable
8. [All tutorials](https://ckeditor.com/docs/ckeditor5/latest/framework/tutorials/index.html)

### Step-by-step Plugin Tutorials
- [Creating a basic plugin (timestamp)](https://ckeditor.com/docs/ckeditor5/latest/framework/tutorials/creating-simple-plugin-timestamp.html) — beginner-friendly, inserts text on button click
- Abbreviation plugin (3-part advanced tutorial):
  - [Part 1: Defining model and view](https://ckeditor.com/docs/ckeditor5/latest/framework/tutorials/abbreviation-plugin/abbreviation-plugin-level-1.html) — schema, upcast/downcast converters
  - [Part 2: Handling user input](https://ckeditor.com/docs/ckeditor5/latest/framework/tutorials/abbreviation-plugin/abbreviation-plugin-level-2.html) — balloon UI, forms
  - [Part 3: Commands and expanded UI](https://ckeditor.com/docs/ckeditor5/latest/framework/tutorials/abbreviation-plugin/abbreviation-plugin-level-3.html) — commands, toggle behavior

### Architecture
- [Plugins in CKEditor 5](https://ckeditor.com/docs/ckeditor5/latest/framework/architecture/plugins.html) — plugin types, packaging, HTML output
- [Core editor architecture — Plugins](https://ckeditor.com/docs/ckeditor5/latest/framework/architecture/core-editor-architecture.html#plugins) — `requires`, `init()`, `afterInit()`
- [Editing engine](https://ckeditor.com/docs/ckeditor5/latest/framework/architecture/editing-engine.html) — model, view, controller in depth
- [Conversion deep dive](https://ckeditor.com/docs/ckeditor5/latest/framework/deep-dive/conversion/intro.html) — advanced conversion topics

### API Reference
- [PluginInterface](https://ckeditor.com/docs/ckeditor5/latest/api/module_core_plugin-PluginInterface.html) — lifecycle methods
- [Framework overview](https://ckeditor.com/docs/ckeditor5/latest/framework/index.html)
- [Full API documentation](https://ckeditor.com/docs/ckeditor5/latest/api/index.html)

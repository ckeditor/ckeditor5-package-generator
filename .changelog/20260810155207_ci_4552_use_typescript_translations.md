---
type: Other
scope:
  - ckeditor5-package-generator
---

Updated generated packages to store translation sources as TypeScript modules.

To upgrade an existing package:

1. Generate a fresh project with the latest version of `ckeditor5-package-generator` and copy the following files to the existing project, preserving any project-specific changes:

    * `AGENTS.md`
    * `eslint.config.js`
    * `README.md`
    * `sample/index.html`
    * `scripts/synchronize-translations.js`
    * `tsconfig.json` (optional, TypeScript projects only)

2. Rewrite every `lang/translations/<language>.po` file as a TypeScript module. Map each PO `msgid` to a dictionary key and its `msgstr` to the value. For example, this `pl.po` entry:

    ```po
    msgid "Save"
    msgstr "Zapisz"
    ```

    becomes `lang/translations/pl.ts`:

    ```ts
    import type { Translations } from 'ckeditor5';

    const translations: Translations = {
      'pl': {
        dictionary: {
          'Save': 'Zapisz'
        }
      }
    };

    export default translations;
    ```

3. In `vite.config.js` or `vite.config.ts`, update the `translations` plugin source:

    ```diff
    - source: '**/*.po'
    + source: '**/lang/translations/*.ts'
    ```

4. Run `translations:synchronize` after converting the files. The command does not read the old `.po` files.

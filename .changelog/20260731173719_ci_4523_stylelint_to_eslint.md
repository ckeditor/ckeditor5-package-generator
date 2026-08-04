---
type: Minor breaking change
scope:
  - ckeditor5-package-generator
see: https://github.com/ckeditor/ckeditor5-internal/issues/4523
---

Replaced Stylelint with ESLint in the generated package. The `stylelint` script, the `.stylelintrc` file and the `stylelint` and `stylelint-config-ckeditor5` dependencies are gone - the `lint` script now covers CSS as well.

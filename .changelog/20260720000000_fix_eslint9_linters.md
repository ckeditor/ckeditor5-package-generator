---
type: Fix
scope:
  - ckeditor5-package-generator
---

Generated packages now pin `eslint-config-ckeditor5` and `eslint-plugin-ckeditor5-rules` to the ESLint 9 compatible major line, so that installing their dependencies no longer fails on an ESLint peer dependency conflict.

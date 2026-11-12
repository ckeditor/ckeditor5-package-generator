---
type: Fix
scope:
  - ckeditor5-package-generator
---

Tests of generated packages now also work on Linux arm64. They run in Chromium, which the new `prepare` script of generated packages downloads through Playwright when the dependencies are installed, also in a fresh clone of the package and on CI. This applies to both the JavaScript and TypeScript templates.

When installing the dependencies of a new package fails, the package generator now shows the end of the installation output and the command to run the installation again.

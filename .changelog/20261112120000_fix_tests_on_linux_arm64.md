---
type: Fix
scope:
  - ckeditor5-package-generator
---

Tests of generated packages now run in Chromium downloaded by Playwright instead of the Google Chrome installed in the system. Google Chrome is not available on Linux arm64, so the tests failed there. The package generator downloads Chromium after installing the dependencies. If the download fails, it shows the commands to install it manually. This applies to both the JavaScript and TypeScript templates.

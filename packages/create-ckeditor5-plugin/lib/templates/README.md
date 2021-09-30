<%= name %>
<% print( '='.repeat( name.length ) ) %>

This package was created by the [create-ckeditor5-plugin](https://www.npmjs.com/package/create-ckeditor5-plugin) package.

## Table of contents

* [Developing the package](#developing-the-package)
* [Available scripts](#available-scripts)
    * [`start`](#start)
    * [`test`](#test)
    * [`lint`](#lint)
    * [`stylelint`](#stylelint)
    * [`dll:build`](#dllbuild)
    * [`dll:serve`](#dllserve)
* [License](#license)

## Developing the package

To read about the CKEditor 5 framework, visit the [CKEditor5 documentation](https://ckeditor.com/docs/ckeditor5/latest/framework/index.html).

## Available scripts

The following scripts are available in the package.

### `start`

Starts the HTTP server with the live-reload mechanism that allows previewing and testing plugins available in the package.

When the server had been started, the default browser will open the developer sample. It can be disabled by passing the `--no-open` option to that command. 

Examples:

```bash
# Starts the server and open the browser.
<%= program %> run start 

# Disable auto-opening the browser.
<%= program %> run start --no-open
```

### `test`

Allows executing unit tests for the package specified in the `tests/` directory. The command accepts the following modifiers:

* `--coverage` – to create the code coverage report,
* `--watch` – to observe the source files (the command does not end after executing tests),
* `--source-map` – to generate source maps of sources,
* `--verbose` – to print additional webpack logs.

Examples:

```bash
# Execute tests.
<%= program %> run test 

# Generate code coverage report after each change in the sources.
<%= program %> run test --coverage --test
```

### `lint`

Runs ESLint which analyzes the code (all `*.js` files) to quickly find problems.

Examples:

```bash
# Execute eslint.
<%= program %> run lint
```

### `stylelint`

Similar to the `lint` task, stylelint analyzes the CSS code (`*.css` files in the `theme/` directory) in the package.

Examples:

```bash
# Execute stylelint.
<%= program %> run stylelint
```

### `dll:build`

Creates the DLL-compatible package build which can be loaded into an editor using [DLL builds](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/development/dll-builds.html). 

Examples:

```bash
# Build the DLL file that is ready to publish.
<%= program %> run dll:build

# Build the DLL file and listen to changes in its sources.
<%= program %> run dll:build --watch
```

### `dll:serve`

Creates the simple HTTP server (without the live-reload mechanism) that allows verifying whether the DLL build of the package is compatible with CKEditor 5 [DLL builds](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/development/dll-builds.html).

Examples:

```bash
# Starts the HTTP server and opens the browser.
<%= program %> run dll:serve
```

## License

The `<%= name %>` package is available under the [MIT license](https://opensource.org/licenses/MIT).

However, it is the default license of packages created by the [create-ckeditor5-plugin](https://www.npmjs.com/package/create-ckeditor5-plugin) package and it can be changed.

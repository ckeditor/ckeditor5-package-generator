<%= name %>
<% print( '='.repeat( name.length ) ) %>

//TODO: update url
This package was generated using [ckeditor5-package-generator](https://github.com/ckeditor/create-ckeditor5-plugin).

## Table of contents

* [Developing the package](#developing-the-package)
* [License](#license)

## Developing the package

To read about the framework, visit the [CKEditor5 documentation](https://ckeditor.com/docs/ckeditor5/latest/framework/index.html).

You can use the following scripts to work on the package:

* `test` - allows executing tests for the package. Available modifiers:
    * `--coverage` - to create the code coverage report,
    * `--watch` - to observe the source files (the command does not end after executing tests),
    * `--source-map` - to generate source maps of sources,
    * `--verbose` - to print additional webpack logs.
* `dll:build` - builds the DLL version of the package.
* `lint` - verifies code style in `*.js` files.
* `stylelint` - verifies code style in `*.css` files located in the `/theme` directory.
* `start` - starts a server that allows manual testing of the plugin.

## License

The `<%= name %>` package is available under the [MIT license](https://opensource.org/licenses/MIT).

However, the developer can change the license of the package at will.

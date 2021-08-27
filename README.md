Create CKEditor 5 Plugin
========================

This tool is used to create plugins / packages for CKEditor5.

## Table of contents

* [Creating a package](#creating-a-package)
   * [Options](#options)
* [License](#license)

## Creating a package

To create a new package, You need to run `index.js` file located in the `lib` directory. Provided directory should start with the `@scope`, and the package name should follow the `ckeditor5-` prefix.

```
node lib/index.js @scope/ckeditor5-package-name
```

### Options

- `-v` / `--verbose` - outputs additional logs
- `--use-npm` - whether use npm to install packages

Example of using some options:

```
node lib/index.js @scope/ckeditor5-package-name -v --use-npm
```

## License

TBA

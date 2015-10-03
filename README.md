# exec-pod-callback

[![NPM version](https://img.shields.io/npm/v/exec-pod-callback.svg)](https://www.npmjs.com/package/exec-pod-callback)
[![Build Status](https://travis-ci.org/shinnn/exec-pod-callback.svg?branch=master)](https://travis-ci.org/shinnn/exec-pod-callback)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/exec-pod-callback.svg)](https://coveralls.io/r/shinnn/exec-pod-callback)
[![Dependency Status](https://david-dm.org/shinnn/exec-pod-callback.svg)](https://david-dm.org/shinnn/exec-pod-callback)
[![devDependency Status](https://david-dm.org/shinnn/exec-pod-callback/dev-status.svg)](https://david-dm.org/shinnn/exec-pod-callback#info=devDependencies)

[Callback](http://thenodeway.io/posts/understanding-error-first-callbacks/)-style version of [exec-pod]:

> Run a `pod` subcommand and buffer the output

```javascript
const execPodCallback = require('exec-pod-callback');

execPodCallback('search', ['AWS'], (err, stdout, stderr) => {
  stdout; //=> '-> AWSAPIGateway (2.2.7)\n   Amazon Web Services SDK for iOS ...'
});
```

## Installation

[Use npm](https://docs.npmjs.com/cli/install):

```
npm install exec-pod-callback
```

and make sure [`cocoapods`](https://rubygems.org/gems/cocoapods/versions/0.39.0) is [installed](https://guides.cocoapods.org/using/getting-started.html#installation).

## API

```javascript
const execPodCallback = require('exec-pod-callback');
```

### execPodCallback(*subcommand* [, *args*, *options*, *cb*])

*subcommand*: `String` (one of the `pod` [subcommands](https://guides.cocoapods.org/terminal/commands.html) to run e.g. `install`)  
*args*: `Array` of strings (arguments passed to the command)  
*options*: `Object`  
*cb*: `Function` (callback function which takes three arguments: `error`, `stdout`, `stderr`)  
Return: [ChildProcess](https://nodejs.org/api/child_process.html#child_process_class_childprocess) instance

It runs the given `pod` subcommand and passes buffered [`stdout`](https://nodejs.org/api/child_process.html#child_process_child_stdout)/[`stderr`](https://nodejs.org/api/child_process.html#child_process_child_stderr) values to the callback function.

```javascript
execPodCallback('install', ['AFNetworking'], {bundleExec: true}, (err, stdout, stderr) => {
  if (err) {
    throw err;
  }

  stdout; //=> 'Updating spec repo `master` ... '
});
```

#### Options

All [`child_process#execFile`](https://nodejs.org/api/child_process.html#child_process_child_process_fork_modulepath_args_options) options and [`bundleExec`](#optionsbundleexec) option are available.

##### options.bundleExec

Type: `Boolean`  
Default: `false`

`true` runs the `pod` command with [`bundle exec`](http://bundler.io/man/bundle-exec.1.html), instead of using globally installed `pod`.

## Related project

* [exec-pod][exec-pod] ([Promises/A+](https://promisesaplus.com/) version)

## License

Copyright (c) 2015 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).

[exec-pod]: https://github.com/shinnn/exec-pod

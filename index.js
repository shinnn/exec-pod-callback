/*!
 * exec-pod-callback | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/exec-pod-callback
*/
const execFileSubcommand = require('execfile-subcommand');

module.exports = function execPodCallback(subcommand, args, options, cb) {
  'use strict';

  if (typeof subcommand !== 'string') {
    throw new TypeError(
      String(subcommand) +
      ' is not a string. Expected one of the `pod` subcommands (e.g. `install`).'
    );
  }

  if (subcommand === '') {
    throw new Error('Expected one of the `pod` subcommands (e.g. `outdated`), but received an empty string.');
  }

  if (cb === undefined) {
    if (options === undefined) {
      cb = args;
      args = [];
      options = {};
    } else {
      cb = options;

      if (Array.isArray(args)) {
        options = {};
      } else {
        options = args || {};
        args = [];
      }
    }
  } else {
    options = options || {};
  }

  if (options.bundleExec !== undefined && typeof options.bundleExec !== 'boolean') {
    throw new TypeError(
      String(options.bundleExec) +
      ' is not Boolean. `bundleExec` option must be Boolean (`false` by default).'
    );
  }

  let cmd;

  if (options.bundleExec) {
    cmd = 'bundle';
    args.unshift('pod', subcommand);
    subcommand = 'exec';
  } else {
    cmd = 'pod';
  }

  if (typeof cb !== 'function') {
    throw new TypeError(
      String(cb) +
      ' is not a function. Expected a callback function called after `' +
      [cmd].concat(subcommand, args).join(' ') +
      '` command runs.'
    );
  }

  return execFileSubcommand(cmd, subcommand, args, options, function callback(err, stdout, stderr) {
    if (err) {
      err.message = err.message.replace('Command failed: ' + err.cmd + '\n', '$&' + stdout + stderr);
      cb(err, stdout, stderr);
      return;
    }

    cb(null, stdout, stderr);
  });
};

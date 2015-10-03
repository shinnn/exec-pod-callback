'use strict';

const execPodCallback = require('.');
const test = require('tape');

test('execPodCallback()', t => {
  t.plan(17);

  t.equal(execPodCallback.name, 'execPodCallback', 'should have a function name.');

  execPodCallback('try', (err, stdout, stderr) => {
    t.equal(err.cmd, 'pod try', 'should pass an error to the callback when the command fails.');
    t.ok(/A Pod name or URL is required\./.test(stdout), 'should pass error messages to `stderr` argument.');
    t.strictEqual(stderr, '', 'should not pass error messages to `stderr` argument.');
  });

  execPodCallback('search', ['AFNetworking'], (err, stdout) => {
    t.strictEqual(
      err,
      null,
      'should not pass any errors to the callback when it successfully runs the command.'
    );
    t.ok(
      /https:\/\/github.com\/AFNetworking\/AFNetworking/.test(stdout),
      'should pass the result to `stdout` argument.'
    );
  });

  execPodCallback('search', ['AFNetworking'], {maxBuffer: 1}, err => {
    t.equal(
      err.message,
      'stdout maxBuffer exceeded.',
      'should accept child_process#execFile options.'
    );
  });

  execPodCallback('insta1l', ['123'], {bundleExec: true}, err => {
    t.equal(
      err.cmd,
      'bundle exec pod insta1l 123',
      'should run the command in a bundler context when `bundleExec` option is enabled.'
    );
  });

  execPodCallback('search', null, {maxBuffer: -1}, err => {
    t.equal(
      err.cmd,
      'pod search',
      'should accept child_process#execFile options.'
    );
  });

  execPodCallback('foobarbazqux', null, (err, stdout) => {
    t.equal(
      err.cmd,
      'pod foobarbazqux',
      'should fail when the subcommand is not valid.'
    );
    t.ok(
      /Unknown command: `foobarbazqux`/.test(stdout),
      'should output "Unknown command" message when the subcommand is not valid.'
    );
  });

  execPodCallback('search', ['.+/', '--verbose'], null, (err, stdout) => {
    t.equal(
      err.cmd,
      'pod search .+/ --verbose',
      'should fail when it tries to search Pods with invlid characters.'
    );
    t.ok(
      /<main>/.test(stdout),
      'should output verbose messages when `--verbose` flag is enabled.'
    );
  });

  t.throws(
    () => execPodCallback(1, t.fail),
    /TypeError.*1 is not a string\. Expected one of the `pod` subcommands \(e\.g\. `install`\)\./,
    'should throw a type error when the first argument is not a string.'
  );

  t.throws(
    () => execPodCallback('', t.fail),
    /Error.*Expected one of the `pod` subcommands \(e\.g\. `outdated`\), but received an empty string\./,
    'should throw an error when the first argument is an empty string.'
  );

  t.throws(
    () => execPodCallback('outdated', 1, {}, t.fail),
    /TypeError.*1 is not an array\. Expected a list of arguments to be passed to `pod outdated` command\./,
    'should throw a type error when a `args` argument takes a truthy value but it\'s not an array.'
  );

  t.throws(
    () => execPodCallback('outdated', [], {bundleExec: 1}, t.fail),
    /TypeError.*1 is not Boolean\. `bundleExec` option must be Boolean \(`false` by default\)\./,
    'should throw a type error when `bundleExec` option is not Boolean.'
  );
});

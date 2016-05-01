'use strict';
/* eslint-env mocha */
var assert = require('assert');
var chalk = require('chalk');
var jshint = require('jshint/src/cli');
var stylish = require('./');

it('should be used by JSHint', function () {
	var ret = false;
	var _log = process.stdout.write.bind(process.stdout);

	process.stdout.write = function (str) {
		_log(str);

		if (/Missing semicolon/ig.test(chalk.stripColor(str || ''))) {
			ret = true;
		}
	};

	jshint.run({
		args: ['fixture.js'],
		reporter: stylish.reporter
	});

	process.stdout.write = _log;

	assert(ret);
});

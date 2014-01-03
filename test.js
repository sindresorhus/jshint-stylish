'use strict';
var assert = require('assert');
var chalk = require('chalk');
var jshint = require('jshint/src/cli').run;
var reporter = require('./stylish.js').reporter;


describe('jshint-stylish', function () {
	it('should be used by JSHint', function () {
		var ret = false;
		var _log = process.stdout.write.bind(process.stdout);

		process.stdout.write = function (str) {
			_log(str);

			if (/line 8   col 1   'describe' is not defined/ig.test(chalk.stripColor(str || ''))) {
				ret = true;
			}
		}

		jshint({
			args: ['test.js'],
			reporter: reporter
		});

		process.stdout.write = _log;

		assert(ret);
	});
});

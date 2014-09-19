'use strict';
var assert = require('assert');
var chalk = require('chalk');
var jshint = require('jshint/src/cli').run;
var reporter = require('./stylish').reporter;

it('should be used by JSHint', function () {
	var ret = false;
	var _log = process.stdout.write.bind(process.stdout);

	process.stdout.write = function (str) {
		_log(str);

		if (/'foo' is defined/ig.test(chalk.stripColor(str || ''))) {
			ret = true;
		}
	};

	jshint({
		args: ['fixture.js'],
		reporter: reporter
	});

	process.stdout.write = _log;

	assert(ret);
});

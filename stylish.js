'use strict';
var chalk = require('chalk');
var table = require('text-table');

module.exports = {
	reporter: function (result, config, options) {
		var total = result.length;
		var ret = '';
		var headers = [];
		var prevfile;
		
		options = options || {};

		options = options || {};

		ret += table(
			result.map(function (el, i) {
				var err = el.error;
				var line = [
					'',
					chalk.gray('line ' + err.line),
					chalk.gray('col ' + err.character),
					chalk.blue(err.reason)
				];

				if (el.file !== prevfile) {
					headers[i] = el.file;
				}

				if (options.verbose) {
					line.push(chalk.gray('(' + err.code + ')'));
				}

				prevfile = el.file;

				return line;
			})
		).split('\n').map(function (el, i) {
			return headers[i] ? '\n' + chalk.underline(headers[i]) + '\n' + el : el;
		}).join('\n') + '\n\n';

		if (total > 0) {
			ret += chalk.red.bold('✖ ' + total + ' problem' + (total === 1 ? '' : 's') + '\n');
		} else {
			ret += chalk.green.bold('✔ No problems\n');
		}

		console.log(ret);
	}
};

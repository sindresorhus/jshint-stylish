'use strict';
var chalk = require('chalk');
var table = require('text-table');
var logSymbols = require('log-symbols');

module.exports = {
	reporter: function (result, config, options) {
		var total = result.length;
		var ret = '';
		var headers = [];
		var prevfile;
		var errorCount = 0;
		var warningCount = 0;

		options = options || {};

		ret += table(result.map(function (el, i) {
			var err = el.error;
			// E: Error, W: Warning, I: Info
			var isError = err.code && err.code[0] === 'E';

			var line = [
				'',
				chalk.gray('line ' + err.line),
				chalk.gray('col ' + err.character),
				isError ? chalk.red(err.reason) : (process.platform !== 'win32' ? chalk.blue(err.reason) : chalk.cyan(err.reason))
			];

			if (el.file !== prevfile) {
				headers[i] = el.file;
			}

			if (options.verbose) {
				line.push(chalk.gray('(' + err.code + ')'));
			}

			if (isError) {
				errorCount++;
			}
			else {
				warningCount++;
			}

			prevfile = el.file;

			return line;
		}), {
			stringLength: function (str) {
				return chalk.stripColor(str).length;
			}
		}).split('\n').map(function (el, i) {
			return headers[i] ? '\n' + chalk.underline(headers[i]) + '\n' + el : el;
		}).join('\n') + '\n\n';

		if (total > 0) {
			if (errorCount > 0) {
				ret += '  ' + logSymbols.error + '  ' + errorCount + ' errors' + (total === 1 ? '' : 's') + (warningCount > 0 ? '\n' : '');
			}
			ret += '  ' + logSymbols.warning + '  ' + warningCount + ' warning' + (total === 1 ? '' : 's');
		} else {
			ret += '  ' + logSymbols.success + ' No problems';
			ret = '\n' + ret.trim();
		}

		console.log(ret + '\n');
	}
};

'use strict';
var chalk = require('chalk');
var table = require('text-table');
var logSymbols = require('log-symbols');
var stringLength = require('string-length');

function pluralize(str, count) {
  return str + (count === 1 ? '' : 's');
}

module.exports = {
  toString: function () {
    return __filename;
  },
  reporter: function (result, config, options) {
    var total = result.length;
    var ret = '';
    var headers = [];
    var prevfile;
    var errorCount = 0;
    var warningCount = 0;
    var chalkWarn = chalk.blue;
    var v;

    options = options || {};

    if ((v = options.sort) || 'undefined' === typeof v) {
      result.sort(function (a, b) {
        var ea = a.error, eb = b.error;

        if (ea.line === eb.line) {
          return ea.character - eb.character;
        }
        return ea.line - eb.line;
      });
    }

    if (options.color) {
      v = null;
      try {
        v = chalk[options.color];
      }
      catch (e) {
      }
      if ('function' === typeof v) {
        chalkWarn = v;
      }
    }

    ret += table(result.map(function (el, i) {
        var err = el.error;
        // E: Error, W: Warning, I: Info
        var isError = err.code && err.code[0] === 'E';

        var line = [
          '',
          chalk.gray('line ' + err.line),
          chalk.gray('col ' + err.character),
          isError ? chalk.red(err.reason) : chalkWarn(err.reason)
        ];

        if (el.file !== prevfile) {
          headers[i] = el.file;
        }

        if (options.verbose) {
          line.push(chalk.gray('(' + err.code + ')'));
        }

        if (isError) {
          errorCount++;
        } else {
          warningCount++;
        }

        prevfile = el.file;

        return line;
      }), {
        stringLength: stringLength
      }).split('\n').map(function (el, i) {
        return headers[i] ? '\n' + chalk.underline(headers[i]) + '\n' + el : el;
      }).join('\n') + '\n\n';

    if (total > 0) {
      if (errorCount > 0) {
        ret += '  ' + logSymbols.error + '  ' + errorCount + pluralize(' error', errorCount) + (warningCount > 0 ? '\n' : '');
      }

      ret += '  ' + logSymbols.warning + '  ' + warningCount + pluralize(' warning', total);
    } else {
      ret += '  ' + logSymbols.success + ' No problems';
      ret = '\n' + ret.trim();
    }

    console.log(ret + '\n');
  }
};

var methods = require('../methods.json');
var fs = require('fs');

const repeat = function(str, times) {
  if (String.prototype.repeat) return str.repeat(times);
  else {
    var out = '';
    while (--times > 0) {
      out += str;
    }
    return out;
  }
};

const pad = function(str, length, align) {
  var padlen = length - str.length;
  if (align === 'left') return str + repeat(' ', padlen);
  else if (align === 'right') return repeat(' ', padlen) + str;
  else if (align === 'center') return repeat(' ', padlen / 2) + str + repeat(' ', padlen / 2);
};

var parsed = [];
for (var key in methods) {
  var options = methods[key].options || {};
  var optional = methods[key].optional || [];
  var urlparams = methods[key].path.match(/\/\:[^\/]+/g) || [];
  urlparams = urlparams.map(function(item) { return item.substr(2); });
  var params = [].concat(
    methods[key].body || [],
    methods[key].query || [],
    urlparams,
    options.pagination ? [ 'limit', 'page' ] : []
  ).map(function(item) {
    if (item === 'limit' || item === 'page') return item;
    return (optional.indexOf(item) !== -1) ? item : item + '\\*';
  });

  parsed.push([
    key.replace(/\//g, '.').substr(1),
    methods[key].method,
    methods[key].path,
    params.join(', '),
    (options.auth || '')
  ]);
}

var docFile = fs.createWriteStream('methods.md');
docFile.write('# Methods map\n\n');
docFile.write('Required parameters are starred\n\n');

var columns = ['Codepath', 'Method', 'Trakt URL', 'Parameters', 'Auth'];
var align = ['left', 'right', 'left', 'left', 'center'];
var longest = [0, 0, 0, 0, 0];

for (var i in parsed) {
  for (var j in parsed[i]) {
    if (parsed[i][j].length > longest[j]) longest[j] = parsed[i][j].length;
  }
}

// Print Header
var c = columns.map(function(t, i) { return ' ' + pad(t, longest[i], align[i]) + ' '; });
docFile.write('|' + c.join('|') + '|\n');

// Print alignment edge
var a = columns.map(function(_, i) {
  var p = repeat('-', longest[i] - 2);
  if (align[i] === 'left') return ' :' + p + '- ';
  else if (align[i] === 'right') return ' -' + p + ': ';
  else if (align[i] === 'center') return ' :' + p + ': ';
});
docFile.write('|' + a.join('|') + '|\n');

// Print items
docFile.write(parsed.map(function(item) {
  // Pad each column
  var p = columns.map(function(_, i) { return ' ' + pad(item[i], longest[i], align[i]) + ' '; });
  return '|' + p.join('|') + '|';
}).join('\n') + '\n');

docFile.end();

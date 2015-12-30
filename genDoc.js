var methods = require('./methods.json');
var fs = require('fs');

var docFile = fs.createWriteStream('methods.md');

docFile.write('## Methods map\n\n');
docFile.write('Optional parameters are inside brackets, otherwise they are required\n\n');
docFile.write('| Codepath | Method | Trakt URL | Parameters | Auth |\n');
docFile.write('|:---------|-------:|:----------|:-----------|:----:|\n');

for(var key in methods) {
  var path = key.replace(/\//g, '.').substr(1);
  var method = methods[key];
  var options = method.options || {};
  var optional = method.optional || [];
  var urlparams = method.path.match(/\/\:[^\/]+/g) || [];
  urlparams = urlparams.map(function(item){ return item.substr(2); });
  var params = [].concat(method.body || [], method.query || [], urlparams);

  params = params.map(function(item) {
    if (optional.indexOf(item) !== -1) {
      return '[' + item + ']';
    } else {
      return item;
    }
  });

  if (options.pagination) {
    params.push('[limit]');
    params.push('[page]');
  }

  docFile.write('|' + path + ' | ' + method.method + ' | ' + method.path + ' | ' + (params.join(', ')) + ' | ' + (options.auth || '') + ' | ' + '\n');
}

docFile.end();

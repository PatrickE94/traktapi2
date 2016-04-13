const A = require('../methods.json');
const B = require('../methods_new.json');

const predefined_parts = ['options', 'path', 'query', 'body', 'optional', 'method'];

const Compare = {
  object: function(x, y) {
    if (!(y instanceof Object)) {
      return '-  ' + Object.keys(x).join('\n-  ');
    }

    var changes = [];
    var keys = unionArrays(Object.keys(x), Object.keys(y));
    for (var i in keys) {
      var key = keys[i];

      if (x[key] === undefined) {
        changes.push('+ ' + key);
        continue;
      }
      if (y[key] === undefined) {
        changes.push('- ' + key);
        continue;
      }

      if (x[key] !== y[key]) {
        changes.push(key + ': ' + x[key] + ' => ' + y[key]);
      }
    }

    return changes.join('\n');
  },
  string: function(x, y) {
    return (x !== y) ? x + ' => ' + y : '';
  },
  array: function(x, y) {
    if (!(y instanceof Array)) {
      return '- ' + x.join('\n-  ');
    }

    var changes = [];
    var items = unionArrays(x, y);
    for (var k in items) {
      if (x.indexOf(items[k]) < 0) {
        changes.push('+ ' + items[k]);
      } else if (y.indexOf(items[k]) < 0) {
        changes.push('- ' + items[k]);
      }
    }

    return changes.join('\n');
  }
};

const unionArrays = function(x, y) {
  return [].concat.call(x || [], y || [])
    .filter(function(m, i, z) { return z.indexOf(m) === i; });
};

console.log('Method name changes:');
console.log('----------------------------------------\n');

var keys = unionArrays(Object.keys(A), Object.keys(B));
var parsed = [];
keys.forEach(function(key) {
  if (A[key] !== undefined && B[key] !== undefined) return;

  if (A[key] === undefined) {
    var found = false;
    for (var j in A) {
      if (B[key].path === A[j].path && B[key].method === A[j].method) {
        console.log('  Moved:', j, '=>', key);
        parsed.push(key);
        parsed.push(j);
        found = true;
        break;
      }
    }
    if (!found) console.log('  Added:', key);
  }
});

keys.forEach(function(key) {
  if (A[key] !== undefined && B[key] !== undefined) return;

  if (B[key] === undefined) {
    if (parsed.indexOf(key) >= 0) return;
    console.log('Removed:', key);
  }
});

console.log('----------------------------------------\n');
console.log('Changes in existing methods: ');
console.log('----------------------------------------\n');

keys.forEach(function(k) {
  if (A[k] === undefined || B[k] === undefined) return;

  var changes = predefined_parts.map(function(part) {
    var result = '';
    if (typeof A[k][part] === 'string') {
      result = Compare.string(A[k][part], B[k][part]);
    } else if (A[k][part] instanceof Array) {
      result = Compare.array(A[k][part], B[k][part]);
    } else if (A[k][part] instanceof Object) {
      result = Compare.object(A[k][part], B[k][part]);
    } else if (A[k][part] === undefined && B[k][part]) {
      if (typeof B[k][part] === 'string') {
        result = '+ ' + B[k][part];
      } else if (B[k][part] instanceof Array) {
        result = B[k][part].map(function(i) { return '+ ' + i; }).join('\n');
      } else if (B[k][part] instanceof Object) {
        for (var i in B[k][part]) {
          result += '+ ' + i + ': ' + B[k][part][i] + '\n';
        }
      }
    }
    if (result) return part + ':\n    ' + result.replace(/\n\r?/g, '\n    ');
  }).filter(function(i) { return !!i; });

  if (changes.length > 0) {
    console.log(k);
    console.log('  ' + changes.join('\n  '));
    console.log('\n');
  }
});

console.log('----------------------------------------\n');

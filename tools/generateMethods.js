const Protagonist = require('protagonist');
const Got = require('got');
const Fs = require('fs');

/**
 * Manual Trakt URL to codepath overrides.
 */
const ManualOverrides = {
  '/movies/{id}': '/movies/summary',
  '/people/{id}': '/people/summary',
  '/shows/{id}': '/shows/summary',
  '/recommendations/movies/{id}': '/recommendations/movies/hide',
  '/recommendations/shows/{id}': '/recommendations/shows/hide',

  '/shows/{id}/seasons/{season}': '/season/summary',
  '/shows/{id}/seasons/{season}/comments/{sort}': '/season/comments',
  '/shows/{id}/seasons/{season}/ratings': '/season/ratings',
  '/shows/{id}/seasons/{season}/stats': '/season/stats',
  '/shows/{id}/seasons/{season}/watching': '/season/watching',

  '/shows/{id}/seasons/{season}/episodes/{episode}': '/episode/summary',
  '/shows/{id}/seasons/{season}/episodes/{episode}/comments/{sort}': '/episode/comments',
  '/shows/{id}/seasons/{season}/episodes/{episode}/ratings': '/episode/ratings',
  '/shows/{id}/seasons/{season}/episodes/{episode}/stats': '/episode/stats',
  '/shows/{id}/seasons/{season}/episodes/{episode}/watching': '/episode/watching',

  '/users/{username}/lists/{id}': '/users/list',
  '/users/{username}/lists/{id}/like': '/users/list/like',
  '/users/{username}/lists/{id}/items/{type}': '/users/list/items',
  '/users/{username}/lists/{id}/items/remove': '/users/list/items/remove'
};

const httpSuffix = function(method) {
  switch (method) {
    case 'GET': return '/get';
    case 'PUT': return '/update';
    case 'DELETE': return '/remove';
    case 'POST': return '/add';
    default:
      console.log('WARNING: Bad method ', method);
      break;
  }
};

const unionArrays = function(x, y) {
  if (!x) return y;
  if (!y) return x;
  var z = x.concat(y);
  return z.filter(function(m, i) { return z.indexOf(m) === i; });
};

const Methods = {
  methods: {},

  push: function(method) {
    // Clean away empty parts
    if (method.optional.length === 0) delete method['optional'];
    if (method.query.length === 0) delete method['query'];
    if (method.body.length === 0) delete method['body'];
    if (Object.keys(method.options).length === 0) delete method['options'];

    // Extract key
    var key = method.key;
    delete method['key'];

    // Check if there is an existing item at the key path
    // It could be if there are multiple methods for a path.
    var existing = this.methods[key];
    if (existing === undefined) {
      this.methods[key] = method;
      console.log('Added method:', method.method, key);
    } else {
      if (existing === null || existing.method !== method.method) {
        if (existing !== null) {
          console.log('Moving:', existing.method, key, '=>', existing.method, key + httpSuffix(existing.method));
          // Move existing to a subkeypath
          this.methods[key + httpSuffix(existing.method)] = existing;
          this.methods[key] = null; // Set to null to block others from using the root path
        }

        // Rename to a subkeypath
        this.methods[key + httpSuffix(method.method)] = method;
        console.log('Added method:', method.method, key + httpSuffix(method.method));
      } else {
        // Append for now, this is two methods using the same path and method
        // but different parameters. For now, allow all parameters and set all to optional.
        this.methods[key].body = unionArrays(this.methods[key].body, method.body);
        this.methods[key].query = unionArrays(this.methods[key].query, method.query);
        this.methods[key].optional = unionArrays(this.methods[key].optional, method.optional);
        console.log('Merged method:', method.method, key);
      }
    }
  },

  get: function() {
    var out = {};
    for (var i in this.methods) {
      if (this.methods[i]) out[i] = this.methods[i];
    }
    return out;
  }
};

const Parser = {

  key: function(path) {
    if (ManualOverrides[path]) return ManualOverrides[path];
    return path
      .replace(/\{\?([^\}]+)\}/g, '')
      .replace(/(\/\{[^\}]+\})+$/gm, '')
      .replace('/{id}', '')
      .replace(/\/?\{([^\}]+)\}/g, '');
  },

  path: function(path) {
    return path
      .replace(/\{\?([^\}]+)\}/g, '')
      .replace(/\{([^\}]+)\}/g, ':$1');
  },

  optionals: function(variables) {
    if (!variables) return [];
    var optionals = [];
    for (var k in variables.content) {
      if (variables.content[k].element === 'member') {
        if (variables.content[k].attributes.typeAttributes.indexOf('optional') >= 0) {
          optionals.push(variables.content[k].content.key.content);
        }
      }
    }
    return optionals;
  },

  options: function(resource, content) {
    if (content.substring(0, 4) === '####') {
      var subtitle = content.substring(0, content.indexOf('\n'));
      var options = subtitle.match(/&#[0-9]+;/g);
      for (var i in options) {
        if (options[i] === '&#128275;') resource.options.auth = 'optional';
        if (options[i] === '&#128274;') resource.options.auth = 'required';
        if (options[i] === '&#128196;') resource.options.pagination = true;
      }
    }
  },

  postData: function(resource, content) {
    var start = content.indexOf('#### JSON POST DATA');
    var end = content.indexOf('####', start + 4);

    if (start < 0) return;
    if (end < 0) end = content.length;

    var lines = content.substring(start, end)
      .replace(/^[^|]{1}.*$/gm, '')
      .replace(/^[|-\s]*$/gm, '')
      .split('\n');
    var outItems = [];
    var optionals = [];
    for (var i in lines) {
      var cols = lines[i].split('|').filter(function(m) { return m !== ''; });
      if (cols.length === 0) continue;
      var required = cols[0].indexOf('*') >= 0;
      var item = cols[0].match(/^\s?\`?([^\s\`\<]+)/);
      if (!item) {
        console.log('Not found: ' + cols[0]);
        continue;
      }
      item = item[1];
      if (item === 'item') {
        var items = lines[i].match(/\`([A-z_-]+)\`/g).map(function(i) {
          return i.replace(/\`/g, '').trim();
        });

        if (items.indexOf('episode') >= 0) {
          // Since episode is a parameter, so must show be
          items.push('show');
        }

        for (var z in items) {
          optionals.push(items[z]);
          outItems.push(items[z]);
        }
      } else {
        if (!required) optionals.push(item);
        outItems.push(item);
      }
    }
    resource.body = unionArrays(resource.body, outItems);
    resource.optional = unionArrays(resource.optional, optionals);
  },

  queryParams: function(path) {
    var match = path.match(/\{\?([^\}]+)\}/);
    if (!match) return [];
    return match[1].split(',');
  },

  createStub: function(element) {
    return {
      options: {},
      method: '',
      path: this.path(element.attributes.href),
      query: this.queryParams(element.attributes.href),
      body: [],
      optional: this.optionals(element.attributes.hrefVariables),
      key: this.key(element.attributes.href)
    };
  },

  resourceContent: function(resource, element) {
    switch (element.element) {
      case 'transition':
      case 'httpTransaction': // We want the sub-elements
        return element.content.map(this.resourceContent.bind(this, resource));

      case 'copy': // Description, provides some body information and all options
        Parser.options(resource, element.content);
        Parser.postData(resource, element.content);
        break;
      case 'httpRequest': // Providers methods and body parameters
        resource.method = element.attributes.method;
        for (var h in element.content) {
          if (element.content[h].element === 'asset') {
            // Merge multiple values for the same method.
            resource.body = unionArrays(resource.body, Object.keys(JSON.parse(element.content[h].content)));
          }
        }
        break;

      case 'httpResponse': break;
      default:
        console.log(element);
        break;
    }
  },

  parse: function(element) {
    switch (element.element) {
      // Get sub items...
      case 'parseResult':
      case 'category':
        element.content.map(Parser.parse);
        break;

      // Discard these
      case 'annotation': return null;
      case 'copy': return null;

      // Parse resource!
      case 'resource':
        for (var i in element.content) {
          if (element.content[i].element !== 'transition') continue;
          var resource = Parser.createStub(element);
          Parser.resourceContent(resource, element.content[i]);
          Methods.push(resource);
        }
        break;

      default:
        console.log('WARNING: Unknown element ', element);
        return null;
    }
  }
};
// Main
console.log('Getting API blueprint...');
Got('https://jsapi.apiary.io/apis/trakt.apib')
.then(function(response) {
  Protagonist.parse(response.body, function(error, result) {
    if (error) {
      console.log(error);
      return;
    }

    console.log('Got API Blueprint...');
    console.log('-----------------------------------');
    Parser.parse(result);
    Fs.writeFile(
      './methods_new.json',
      JSON.stringify(Methods.get(), undefined, 2),
      function(err) {
        if (err) return console.log(err);
        console.log('-----------------------------------');
        console.log('Wrote methods to methods_new.json');
      }
    );
  });
});

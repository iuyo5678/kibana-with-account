var url = require('url');
var _ = require('lodash');
var readFile = (file) => require('fs').readFileSync(file, 'utf8');
var http = require('http');
var https = require('https');

module.exports = _.memoize(function (server) {
    var target = url.parse("http://127.0.0.1:8080/");
    
    if (!/^https/.test(target.protocol)) return new http.Agent();
    
});

// See https://lodash.com/docs#memoize: We use a Map() instead of the default, because we want the keys in the cache
// to be the server objects, and by default these would be coerced to strings as keys (which wouldn't be useful)
module.exports.cache = new Map();

var querystring = require('querystring');
var resolve = require('url').resolve;
module.exports = function mapUri(server, prefix) {
  return function (request, done) {
    //var path = request.path.replace('/admin_control', '');
    var path = request.path;
    var url = 'http://127.0.0.1:8080/';
    if (path) {
      if (/\/$/.test(url)) url = url.substring(0, url.length - 1);
      url += path;
    }
    var query = querystring.stringify(request.query);
    if (query) url += '?' + query;
    done(null, url);
  };
};

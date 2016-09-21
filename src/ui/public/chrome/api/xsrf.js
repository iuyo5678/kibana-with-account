import $ from 'jquery';
import { set } from 'lodash';

var Cookie = require('cookie');

export default function (chrome, internals) {

  chrome.getXsrfToken = function () {
    return internals.version;
  };

  $.ajaxPrefilter(function ({ kbnXsrfToken = true }, originalOptions, jqXHR) {
    if (kbnXsrfToken) {
      jqXHR.setRequestHeader('kbn-version', internals.version);
    }
    var cookies = Cookie.parse(document.cookie);
    if (cookies.crumb) {
      config.headers['X-CSRF-Token'] = cookies.crumb;
    }
  });

  chrome.$setupXsrfRequestInterceptor = function ($httpProvider) {
    $httpProvider.interceptors.push(function () {
      return {
        request: function (opts) {
          const { kbnXsrfToken = true } = opts;
          if (kbnXsrfToken) {
            set(opts, ['headers', 'kbn-version'], internals.version);
            var cookies = Cookie.parse(document.cookie);
            if (cookies.crumb) {
              set(opts, ['headers', 'X-CSRF-Token'], cookies.crumb);
            }
          }
          return opts;
        }
      };
    });
  };
}

define(function (require) {
  var html = require('ui/account/account.html');
  var module = require('ui/modules').get('ui/account');

  module.directive('kbnLogout', function () {
    return {
      restrict: 'E',
      replace: true,
      template: html
    };
  });
});

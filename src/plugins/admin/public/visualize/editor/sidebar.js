define(function (require) {
  require('ui/modules')
    .get('app/visualize')
    .directive('visEditorSidebar', function () {
      var _ = require('lodash');

      require('plugins/admin/visualize/editor/agg_group');
      require('plugins/admin/visualize/editor/vis_options');

      return {
        restrict: 'E',
        template: require('plugins/admin/visualize/editor/sidebar.html'),
        scope: true,
        controllerAs: 'sidebar',
        controller: function ($scope) {
          $scope.$bind('vis', 'editableVis');
          $scope.$bind('outputVis', 'vis');
          this.section = _.get($scope, 'vis.type.requiresSearch') ? 'data' : 'options';
        }
      };
    });
});

define(function (require) {
  require('plugins/admin/visualize/styles/main.less');

  require('plugins/admin/visualize/editor/editor');
  require('plugins/admin/visualize/wizard/wizard');

  require('ui/routes')
    .when('/visualize', {
      redirectTo: '/visualize/step/1'
    });

  // preloading
  require('plugins/admin/visualize/editor/add_bucket_agg');
  require('plugins/admin/visualize/editor/agg');
  require('plugins/admin/visualize/editor/agg_add');
  require('plugins/admin/visualize/editor/agg_filter');
  require('plugins/admin/visualize/editor/agg_group');
  require('plugins/admin/visualize/editor/agg_param');
  require('plugins/admin/visualize/editor/agg_params');
  require('plugins/admin/visualize/editor/editor');
  require('plugins/admin/visualize/editor/nesting_indicator');
  require('plugins/admin/visualize/editor/sidebar');
  require('plugins/admin/visualize/editor/vis_options');
  require('plugins/admin/visualize/saved_visualizations/_saved_vis');
  require('plugins/admin/visualize/saved_visualizations/saved_visualizations');

  require('ui/saved_objects/saved_object_registry')
    .register(require('plugins/admin/visualize/saved_visualizations/saved_visualization_register'));

});

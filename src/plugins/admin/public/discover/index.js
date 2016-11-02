define(function (require, module, exports) {
  require('plugins/admin/discover/saved_searches/saved_searches');
  require('plugins/admin/discover/directives/timechart');
  require('ui/collapsible_sidebar');
  require('plugins/admin/discover/components/field_chooser/field_chooser');
  require('plugins/admin/discover/controllers/discover');
  require('plugins/admin/discover/styles/main.less');

  // preload
  require('ui/doc_table/components/table_row');

  require('ui/saved_objects/saved_object_registry').register(require('plugins/admin/discover/saved_searches/saved_search_register'));

});

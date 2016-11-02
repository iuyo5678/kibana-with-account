define(function (require) {
  // each of these private modules returns an object defining that section, their properties
  // are used to create the nav bar
  return [
    require('plugins/admin/settings/sections/indices/index'),
    require('plugins/admin/settings/sections/advanced/index'),
    require('plugins/admin/settings/sections/objects/index'),
    require('plugins/admin/settings/sections/status/index'),
    require('plugins/admin/settings/sections/about/index')
  ];
});

module.exports = function (kibana) {
  return new kibana.Plugin({

    config: function (Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
        defaultAppId: Joi.string().default('discover'),
        index: Joi.string().default('.kibana')
      }).default();
    },

    uiExports: {
      app: {
        title: 'admin',
        description: 'the kibana you know and love this page is for admin page',
        //icon: 'plugins/admin/settings/sections/about/barcode.svg',
        main: 'plugins/admin/kibana',
        uses: [
          'visTypes',
          'spyModes'
        ],

        autoload: kibana.autoload.require.concat(
          'plugins/admin/discover',
          'plugins/admin/visualize',
          'plugins/admin/dashboard',
          'plugins/admin/settings',
          'plugins/admin/settings/sections',
          'plugins/admin/doc',
          'plugins/admin/settings/sections',
          'ui/vislib',
          'ui/agg_response',
          'ui/agg_types',
          'leaflet'
        ),

        injectVars: function (server, options) {
          let config = server.config();

          return {
            kbnDefaultAppId: config.get('kibana.defaultAppId')
          };
        }
      }
    }
  });
};

define(function (require) {
  var {IndexPatternMissingIndices} = require('ui/errors');

  require('ui/routes')
    .when('/settings/indices/', {
      template: require('plugins/kibana/settings/sections/indices/index.html')
    });

  // add a dependency to all of the subsection routes
  require('ui/routes')
    .defaults(/settings\/indices/, {
      resolve: {
        indexPatternIds: function (courier) {
          return courier.indexPatterns.getIds();
        }
      }
    });

  require('ui/modules').get('apps/settings')
    .controller('settingsIndicesCreate', function ($scope, kbnUrl, Private, Notifier, indexPatterns, es, config) {
      var notify = new Notifier();
      var refreshKibanaIndex = Private(require('plugins/kibana/settings/sections/indices/_refresh_kibana_index'));

      $scope.createIndexPattern = function () {
        // get an empty indexPattern to start
        indexPatterns.get()
          .then(function (indexPattern) {
            // fetch the fields
            return indexPattern.create()
              .then(function (id) {
                if (id) {
                  refreshKibanaIndex().then(function () {
                    if (!config.get('defaultIndex')) {
                      config.set('defaultIndex', indexPattern.id);
                    }
                    indexPatterns.cache.clear(indexPattern.id);
                    kbnUrl.change('/settings/indices/' + indexPattern.id);
                  });
                }
              });

          })
          .catch(function (err) {
            if (err instanceof IndexPatternMissingIndices) {
              notify.error('Could not locate any indices matching that pattern. Please add the index to Elasticsearch');
            }
            else notify.fatal(err);
          });
      };

    });

  return {
    name: 'indices',
    display: 'Indices',
    url: '#/settings/indices',
  };
});

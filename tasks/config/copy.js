module.exports = function (grunt) {
  return {
    devSource: {
      options: { mode: true },
      src: [
        'src/**',
        'bin/**',
        'webpackShims/**',
        'config/kibana.yml',
        'config/config.example',
        '!src/**/__tests__/**',
        '!src/testUtils/**',
        '!src/fixtures/**',
        '!src/plugins/devMode/**',
        '!src/plugins/testsBundle/**',
        '!src/cli/cluster/**',
      ],
      dest: 'build/kibana',
      expand: true
    },
  };
};

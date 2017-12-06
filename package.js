Package.describe({
  name         : 'copypants:smugmug-oauth',
  version      : '0.0.1',
  summary      : 'Login service for smugmug accounts',
  git          : '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.4.1.1');

  // Third-party packages
  api.use('ecmascript');
  api.use('http', ['client', 'server']);
  api.use('templating', 'client');
  api.use('oauth1', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('random', 'client');
  api.use('underscore', 'server');
  api.use('service-configuration', ['client', 'server']);

  // Package files
  api.addFiles('smugmug_client.js', 'client');
  api.addFiles('smugmug_server.js', 'server');

  // Exposed object
  api.export('Smugmug');
});

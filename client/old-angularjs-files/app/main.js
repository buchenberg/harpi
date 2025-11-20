// Main application entry point
import './config.js'
import './init.js'

// Import all modules
import '../modules/core.client.module.js'
import '../modules/users.client.module.js'
import '../modules/projects.client.module.js'
import '../modules/hars.client.module.js'
import '../modules/specs.client.module.js'

// Bootstrap the application
angular.element(document).ready(function() {
  angular.bootstrap(document, ['harpi'])
})

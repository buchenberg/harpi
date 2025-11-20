(function () {
  'use strict';

  // Configuring the Specs module
  angular.module('specs').run(['Menus',
    function (Menus) {
      // Add the Specifications dropdown item
      Menus.addMenuItem('topbar', {
        title: 'Specifications',
        state: 'specs',
        type: 'dropdown',
        roles: ['*']
      });

      // Add the dropdown list item
      Menus.addSubMenuItem('topbar', 'specs', {
        title: 'List Specifications',
        state: 'specs.list'
      });
    }
  ]);

})();

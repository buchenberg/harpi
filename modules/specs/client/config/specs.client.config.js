(function () {
  'use strict';

  angular
    .module('specs')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Specs',
      state: 'specs',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'specs', {
      title: 'List Specs',
      state: 'specs.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'specs', {
      title: 'Create Spec',
      state: 'specs.create',
      roles: ['user']
    });
  }
})();

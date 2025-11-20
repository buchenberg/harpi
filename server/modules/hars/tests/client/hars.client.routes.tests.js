(function () {
  'use strict';

  describe('Hars Route Tests', function () {
    // Initialize global variables
    var $scope,
      HarsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _HarsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      HarsService = _HarsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('hars');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/hars');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          HarsController,
          mockHar;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('hars.view');
          $templateCache.put('modules/hars/client/views/view-har.client.view.html', '');

          // create mock Har
          mockHar = new HarsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Har Name'
          });

          //Initialize Controller
          HarsController = $controller('HarsController as vm', {
            $scope: $scope,
            harResolve: mockHar
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:harId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.harResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            harId: 1
          })).toEqual('/hars/1');
        }));

        it('should attach an Har to the controller scope', function () {
          expect($scope.vm.har._id).toBe(mockHar._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/hars/client/views/view-har.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          HarsController,
          mockHar;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('hars.create');
          $templateCache.put('modules/hars/client/views/form-har.client.view.html', '');

          // create mock Har
          mockHar = new HarsService();

          //Initialize Controller
          HarsController = $controller('HarsController as vm', {
            $scope: $scope,
            harResolve: mockHar
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.harResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/hars/create');
        }));

        it('should attach an Har to the controller scope', function () {
          expect($scope.vm.har._id).toBe(mockHar._id);
          expect($scope.vm.har._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/hars/client/views/form-har.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          HarsController,
          mockHar;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('hars.edit');
          $templateCache.put('modules/hars/client/views/form-har.client.view.html', '');

          // create mock Har
          mockHar = new HarsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Har Name'
          });

          //Initialize Controller
          HarsController = $controller('HarsController as vm', {
            $scope: $scope,
            harResolve: mockHar
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:harId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.harResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            harId: 1
          })).toEqual('/hars/1/edit');
        }));

        it('should attach an Har to the controller scope', function () {
          expect($scope.vm.har._id).toBe(mockHar._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/hars/client/views/form-har.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();

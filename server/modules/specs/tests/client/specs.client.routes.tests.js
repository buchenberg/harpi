(function () {
  'use strict';

  describe('Specs Route Tests', function () {
    // Initialize global variables
    var $scope,
      SpecsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SpecsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SpecsService = _SpecsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('specs');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/specs');
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
          SpecsController,
          mockSpec;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('specs.view');
          $templateCache.put('modules/specs/client/views/view-spec.client.view.html', '');

          // create mock Spec
          mockSpec = new SpecsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Spec Name'
          });

          //Initialize Controller
          SpecsController = $controller('SpecsController as vm', {
            $scope: $scope,
            specResolve: mockSpec
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:specId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.specResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            specId: 1
          })).toEqual('/specs/1');
        }));

        it('should attach an Spec to the controller scope', function () {
          expect($scope.vm.spec._id).toBe(mockSpec._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/specs/client/views/view-spec.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SpecsController,
          mockSpec;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('specs.create');
          $templateCache.put('modules/specs/client/views/form-spec.client.view.html', '');

          // create mock Spec
          mockSpec = new SpecsService();

          //Initialize Controller
          SpecsController = $controller('SpecsController as vm', {
            $scope: $scope,
            specResolve: mockSpec
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.specResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/specs/create');
        }));

        it('should attach an Spec to the controller scope', function () {
          expect($scope.vm.spec._id).toBe(mockSpec._id);
          expect($scope.vm.spec._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/specs/client/views/form-spec.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SpecsController,
          mockSpec;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('specs.edit');
          $templateCache.put('modules/specs/client/views/form-spec.client.view.html', '');

          // create mock Spec
          mockSpec = new SpecsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Spec Name'
          });

          //Initialize Controller
          SpecsController = $controller('SpecsController as vm', {
            $scope: $scope,
            specResolve: mockSpec
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:specId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.specResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            specId: 1
          })).toEqual('/specs/1/edit');
        }));

        it('should attach an Spec to the controller scope', function () {
          expect($scope.vm.spec._id).toBe(mockSpec._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/specs/client/views/form-spec.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();

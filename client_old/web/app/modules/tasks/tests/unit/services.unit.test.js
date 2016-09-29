describe('tasks service tests', () => {
  let $http;
  let Tasks;

  // Then we can start by loading the main application module
  beforeEach(module(ApplicationConfiguration.applicationModuleName));

  // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
  // This allows us to inject a service but then attach it to a variable
  // with the same name as the service.
  beforeEach(inject(($injector, _$http_, _$httpBackend_, _Tasks_, _MEANRestangular_) => {
    // Point global variables to injected services
    $http = _$http_;
    $http.get = jasmine.createSpy('get');

    // $httpBackend = _$httpBackend_;
    // MEANRestangular = _MEANRestangular_;
    // Restangular = _Restangular_;
    // Restangular = $injector.get("Restangular");

    // defining a spy on an existing property: testPerson.getName() calls an anonymous function
    /* MEANRestangular.all = jasmine.createSpy('all')
      .andReturn({
        'getList': jasmine.createSpy('getList')
      });*/

    Tasks = _Tasks_;
  }));


  it('get all tasks api call', () => {
    // List options or pagination
    const options = {
      // None
    };

    // Get all
    Tasks.getAll(options);

    // Check get call and call options
    expect($http.get).toHaveBeenCalled();
    expect($http.get).toHaveBeenCalledWith('https://localhost:3000/api/v1/tasks/', options);
  });
});

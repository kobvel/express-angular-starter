describe('tasks service tests', () => {
  var $http;
  var $httpBackend;
  var Tasks;
  var MEANRestangular;


  // Then we can start by loading the main application module
  beforeEach(module(ApplicationConfiguration.applicationModuleName));

  // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
  // This allows us to inject a service but then attach it to a variable
  // with the same name as the service.
  beforeEach(inject((_$http_, _$httpBackend_, _Tasks_, _MEANRestangular_) => {

    // Point global variables to injected services
    $http = _$http_;
    $http.get = jasmine.createSpy('get');

    $httpBackend = _$httpBackend_;

    Tasks = _Tasks_;

  }));


  it('test get all tasks api call', () => {
    Tasks.getAll();

    expect($http.get).toHaveBeenCalled();
    expect($http.get).toHaveBeenCalledWith('https://localhost:3000/api/v1/tasks/', undefined);
  });
});

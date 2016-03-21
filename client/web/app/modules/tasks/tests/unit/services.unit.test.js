describe('tasks service tests', () => {
  var mockMEANRestangular;
  var tasksObj;

  beforeEach(() => {
    module(($provide) => {
      $provide.service('Tasks', () => {
        this.create = jasmine.createSpy('create');
        this.getAll = jasmine.createSpy('getAll');
      });
    });

    module('services');
  });

  beforeEach(inject((Tasks, MEANRestangular) => {
    tasksObj = Tasks;
    mockMEANRestangular = MEANRestangular;
  }));

  it('test get all tasks api call', () => {
    tasksObj.getAll();

    expect(mockMEANRestangular.all).toHaveBeenCalled();
    expect(mockMEANRestangular.all).toHaveBeenCalledWith('tasks');
    expect(mockMEANRestangular.all('tasks').getList).toHaveBeenCalled();
  });
});

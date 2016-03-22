'use strict';

var url = browser.params.baseUrl;

var randomEmail = function () {
  return 'mean_signup_test_' + Math.floor((Math.random() * 10000000) + 1) + '@yopmail.com';
};

var user = {
  firstName: 'First Name',
  lastName: 'Last Name',
  email: randomEmail(),
  password: 'password',
};

function openSignupModal() {
  // loguot
  element(by.id('logoutbutton')).isDisplayed().then((result) => {
    if (result) element(by.id('logoutbutton')).click();
  });
  // open signup
  expect(element(by.id('openloginmodal')).isDisplayed()).toBe(true);
  element(by.id('openloginmodal')).click();
  element(by.id('signupbutton')).click();
  expect(element(by.id('signup')).isDisplayed()).toBe(true);
  expect(element(by.buttonText('Signup!')).isDisplayed()).toBe(true);
}

describe('Create task E2E Tests:', () => {
  // Basic test
  it('should be able to signup a new user and create new task', () => {
    browser.get(url);
    openSignupModal();

    element(by.id('name')).sendKeys(user.firstName);
    element(by.id('email')).sendKeys(user.email);
    element(by.id('password')).sendKeys(user.password);
    // browser.ignoreSynchronization = true;
    element(by.id('signup')).click();

    expect(element(by.id('successMessage')).isDisplayed()).toEqual(true);
    expect(element(by.id('successMessage')).getText())
      .toContain('Account created. Automatic login into your account');
    // browser.ignoreSynchronization = false;

    browser.get(url + '/tasks/create');
    browser.sleep(2000);

    element(by.id('title')).sendKeys('Taks Name ' + Math.floor((Math.random() * 10000000) + 1));
    element(by.id('create')).click();

    expect(element(by.id('alertTitle')).isDisplayed()).toEqual(true);
    expect(element(by.id('alertTitle')).getText()).toContain('Success');
  });
}, 50 * 1000);

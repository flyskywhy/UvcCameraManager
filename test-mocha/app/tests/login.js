/// <reference path="../steps.d.ts" />
Feature('In-Valid Login works as expected');

Before((I, initStep) => {
    initStep.toHome();
});

After((I) => {
});

Scenario('Perform invalid login @login', (I, HomePage, LoginPleasePage, LoginPage, ManageScreenPage) => {
    HomePage.toLoginPlease();
    LoginPleasePage.toLogin();
    LoginPage.login(12345678901, 'abc');
    ManageScreenPage.ensureManageScreenPageIsNotOpen();
});

Scenario('Login using valid credentials @login', (I, HomePage, LoginPleasePage, LoginPage, ManageScreenPage) => {
    let config = require('../properties');
    HomePage.toLoginPlease();
    LoginPleasePage.toLogin();
    LoginPage.login(config.credentials.phone, config.credentials.password);
    ManageScreenPage.ensureManageScreenPageIsOpen();
});

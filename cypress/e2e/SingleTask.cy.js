import { clickElement, getElement, goToPage, loadingHomePage } from '../libs/basePageFunction';
import { AdminTask, UserTask } from '../libs/constant';
import { taskCreationPage } from '../libs/taskCreationPage';
import { taskDetailPage } from '../libs/taskDetailPage';
import { checkAndLogout, LoginUser } from '../libs/UserPage';

describe('Feature: งานเดี่ยว', () => {
  let taskId;

  context('admin', () => {

    before(() => {
      LoginUser(AdminTask);
    });

    beforeEach(() => {
      cy.login(AdminTask);
    });

    after(() => {
      cy.logout(); // Logout once after all admin tests
    });

    it('สร้างงานใหม่', () => {
      taskCreationPage.setUpInterceptCreate();
      taskCreationPage.goToCreatePage();
      taskCreationPage.fillForm();
      taskCreationPage.submitForm().then((id) => {
        taskId = id;
        loadingHomePage();
        getElement(`[data-task-id="${id}"]`).should('exist').scrollIntoView().wait(2000);
      });
    });
  });

  context('ช่าง', () => {

    before(() => {
      LoginUser(UserTask);
    });

    beforeEach(() => {
      cy.login(UserTask);
      taskDetailPage.setUpInterceptDetail();
      goToPage('/');
      loadingHomePage();
      cy.wait(2000);
    });

    after(() => {
      cy.logout(); // Logout once after all tests in this context
    });

    it('รับงาน', () => {
      taskDetailPage.acceptTask(taskId);
      loadingHomePage();
      clickElement('[data-tabs="tabs-1"]');
      getElement(`[data-task-id="${taskId}"]`).should('exist').scrollIntoView().wait(2000);
    });

    it('ส่งมอบงาน', () => {
      taskDetailPage.deliverTask(taskId);
      loadingHomePage();
      clickElement('[data-tabs="tabs-2"]');
      getElement(`[data-task-id="${taskId}"]`).should('exist').scrollIntoView().wait(2000);
    });
  });

  context('admin', () => {
    before(() => {
      LoginUser(AdminTask);
    });

    beforeEach(() => {
      cy.login(AdminTask);
    });

    after(() => {
      cy.logout(); // Logout after all admin tests in this context
    });

    it('ตรวจสอบงาน', () => {
      taskDetailPage.setUpInterceptDetail();
      taskDetailPage.approveTask(taskId);
      loadingHomePage();
      clickElement('[data-tabs="tabs-3"]');
      getElement(`[data-task-id="${taskId}"]`).should('exist').scrollIntoView().wait(2000);
    });
  });
});

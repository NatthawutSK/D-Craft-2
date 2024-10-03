import { clickElement, getElement, goToPage, loadingHomePage } from '../libs/basePageFunction';
import { UserTask, AdminTask } from '../libs/constant';
import { taskGroupPage } from '../libs/taskGroupPage';
import { LoginUser } from '../libs/UserPage';


describe('Feature: กลุ่มงาน', () => {
  const numOfTasks = 2;
  let taskIds = [];
  let groupId = '';

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

    it('สร้างงานเพื่อรอจับกลุ่มงาน', () => {
      taskGroupPage.setUpInterceptGroup();
      taskGroupPage.createGroupTasks(numOfTasks).then((ids) => {
        taskIds = ids;
        expect(taskIds).to.have.length(numOfTasks);
      });
    });

    it('จับกลุ่มงาน', () => {
      taskGroupPage.groupingTask(taskIds, numOfTasks).then((id) => {
        groupId = id;
        expect(groupId).to.not.be.empty;
      });
    });
  });

  context('ช่าง', () => {
    before(() => {
      LoginUser(UserTask);
    });

    beforeEach(() => {
      cy.login(UserTask);
      taskGroupPage.setUpInterceptGroup();
      goToPage('/');
      loadingHomePage();
    });

    after(() => {
      cy.logout(); // Logout once after all admin tests
    });

    it('รับกลุ่มงาน', () => {
      taskGroupPage.acceptGroupTask(groupId);
      loadingHomePage();
      clickElement('[data-tabs="tabs-1"]');
      cy.wait(2000);
      taskIds.forEach((taskId) => {
        getElement(`[data-task-id="${taskId}"]`).scrollIntoView().should('exist');
      });
    });
  });


});

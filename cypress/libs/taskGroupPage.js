import { goToPage, clickElement, waitForRequest, interceptReqGroupPage, interceptReqCreatePage, loadingHomePage, getElement, interceptReqListPage } from './basePageFunction';
import { taskCreationPage } from './taskCreationPage';


const groupingTask = (taskIds, numOfTasks) => {
    expect(taskIds).to.have.length(numOfTasks);

    // After task creation, navigate to Group Tasks page
    goToPage('/app/group-tasks');
    getElement('[data-label="Add Group Tasks"]').click();

    // Click on the Table Multiselect field to focus and make options visible
    getElement('.frappe-control[data-fieldname="group"] input')
        .type(taskIds[0]); // Type first taskId to trigger the dropdown

    // Wait for the dropdown to become visible
    getElement('.frappe-control[data-fieldname="group"] ul')
        .should('be.visible');

    // Select each taskId from the options
    taskIds.forEach((taskId) => {
        // Type the taskId to filter the options
        getElement('.frappe-control[data-fieldname="group"] input')
            .clear()
            .type(taskId); // Type the taskId to filter options

        // Wait for and click the matching option
        getElement('.frappe-control[data-fieldname="group"] ul')
            .find('div[role="option"]')
            .contains(taskId)
            .click({ force: true });
    });
    cy.intercept('POST', '/api/method/frappe.desk.form.save.savedocs').as('saveGroup');

    // Submit the form after selecting tasks
    getElement('[data-label="Save"]').click();
    // /api/method/frappe.desk.form.save.savedocs

    return cy.wait('@saveGroup').then(() => {
        return cy.url().should('include', '/app/group-tasks/').then((url) => {
            // Extract the groupId from the URL (assuming it's the last part of the URL path)
            const groupId = url.split('/').pop();
            cy.log('Group ID:', groupId);

            // Chain another `cy.then()` to ensure the value is returned asynchronously
            return cy.wrap(groupId);
        })
    })
};

const acceptGroupTask = (groupId) => {
    getElement(`[data-group-id="${groupId}"]`).scrollIntoView().should('exist').wait(2000);
    clickElement(`[data-testid="button-detail-group-${groupId}"]`)
    waitForRequest('@getDetailGroup');
    cy.wait(2000);
    clickElement('[data-testid="button-submit-group"]');
    waitForRequest(['@createTask', '@linkCore', '@keepData', '@changeStatus']);

}

const createGroupTasks = (numOfTasks) => {
    const taskIds = [];

    const createTask = () => {
        return cy.wrap(null, { timeout: 20000 }).then(() => {
            taskCreationPage.goToCreatePage();
            taskCreationPage.fillForm({ isGroup: true });
            return taskCreationPage.submitForm().then((id) => {
                taskIds.push(id);
            });
        });
    };

    // Execute the task creation sequentially for each task
    cy.wrap(null).then(() => {
        for (let i = 0; i < numOfTasks; i++) {
            createTask();
        }
    });

    // Return taskIds after all tasks are created
    return cy.wrap(null).then(() => taskIds);
};

export const taskGroupPage = {
    setUpInterceptGroup: () => {
        interceptReqCreatePage();
        interceptReqGroupPage();
        interceptReqListPage();
    },
    createGroupTasks,
    groupingTask,
    acceptGroupTask,
};
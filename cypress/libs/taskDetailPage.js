import { clickElement, goToPage, waitForRequest, interceptReqDetailPage, interceptReqListPage, loadingHomePage, getElement } from './basePageFunction';


const uploadImage = () => {
    cy.intercept('POST', '/api/method/upload_file').as('uploadImage');
    const imagePath = '../../src/assets/images/capybara.jpg';
    cy.get('[data-testid="input-house_img"] input[type="file"]').attachFile(imagePath);
    cy.wait('@uploadImage').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        cy.get('[data-testid="image-preview-house_img"]')
            .should('be.visible')
            .and('have.attr', 'src')
            .and('include', 'capybara.jpg');
    });
};


const ReviewTask = (taskId) => {
    goToPage(`/app/core-tasks/${taskId}`);
    cy.wait(2000);
    cy.get('[data-label="Actions"]').click();
    cy.wait(3000);
    cy.contains('Go To Done').click();
}

const acceptTask = (taskId) => {
    getElement(`[data-task-id="${taskId}"]`).scrollIntoView().should('exist').wait(2000);
    clickElement(`[data-testid="button-detail-${taskId}"]`);
    waitForRequest(['@getDetailTask']);
    cy.wait(2000);
    clickElement('[data-testid="button-submit"]');
    waitForRequest(['@createTask', '@linkCore', '@keepData', '@changeStatus']);

}

const deliverTask = (taskId) => {
    clickElement('[data-tabs="tabs-1"]');
    getElement(`[data-task-id="${taskId}"]`).scrollIntoView().should('exist').wait(2000);
    clickElement(`[data-testid="button-detail-${taskId}"]`);
    waitForRequest(['@getDetailTask']);
    uploadImage();
    clickElement('[data-testid="button-submit"]');
    waitForRequest(['@createTask', '@linkCore', '@keepData', '@changeStatus']);
}

const approveTask = (taskId) => {
    ReviewTask(taskId);
    cy.wait(2000);
    goToPage('/');
}

export const taskDetailPage = {
    setUpInterceptDetail: () => {
        interceptReqDetailPage();
        interceptReqListPage();
    },
    acceptTask,
    deliverTask,
    approveTask
};
import { URL } from "./constant";

export const goToPage = (path) => cy.visit(URL + path);
export const getElement = (selector) => cy.get(selector);
export const clickElement = (selector) => getElement(selector).click();
export const typeIntoElement = (selector, text) => getElement(selector).type(text);
export const waitForRequest = (alias) => cy.wait(alias);

export const interceptReqListPage = () => {
    cy.intercept('GET', '/api/method/get_all_group').as('getAllGroup');
    cy.intercept('GET', '/api/method/list_all_task').as('listAllTask');
}

export const interceptReqDetailPage = () => {
    cy.intercept('POST', '/api/method/frappe.model.workflow.get_transitions').as('getTansitions');
    cy.intercept('POST', '/api/method/get_detail_task').as('getDetailTask');
    cy.intercept('POST', '/api/method/frappe.client.insert').as('createTask');
    cy.intercept('POST', '/api/method/link_core').as('linkCore');
    cy.intercept('POST', '/api/method/keep_prev_data').as('keepData')
    cy.intercept('POST', '/api/method/change_status').as('changeStatus');
}

export const interceptReqCreatePage = () => {
    cy.intercept('POST', '/api/method/get_first_status').as('getFirstStatus');
    cy.intercept('POST', '/api/method/get_schema').as('getSchema');
    cy.intercept('POST', '/api/method/frappe.client.insert').as('createTask');
    cy.intercept('POST', '/api/method/link_core').as('linkCore');
    cy.intercept('POST', '/api/method/keep_prev_data').as('keepData');
}

export const loadingHomePage = () => {
    waitForRequest(['@getAllGroup', '@listAllTask']);
}

export const interceptReqGroupPage = () => {
    cy.intercept('POST', '/api/method/get_detail_group').as('getDetailGroup');
    cy.intercept('POST', '/api/method/change_status').as('changeStatus');
}

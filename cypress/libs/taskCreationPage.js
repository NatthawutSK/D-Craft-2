import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import { clickElement, typeIntoElement, waitForRequest, goToPage, interceptReqCreatePage, interceptReqListPage } from './basePageFunction';


const getRandomOptions = (options, numSelections = 1) => {
    const selectedValues = [];

    for (let i = 0; i < numSelections; i++) {
        // Get a random index
        const randomIndex = Math.floor(Math.random() * options.length);

        // Ensure unique selection if selecting multiple values
        const selectedOption = options[randomIndex];
        if (!selectedValues.includes(selectedOption)) {
            selectedValues.push(selectedOption);
        } else {
            // Retry the selection if a duplicate was found
            i--;
        }
    }

    // Return the selected value or values based on the number of selections
    return numSelections === 1 ? selectedValues[0] : selectedValues;
};

const fillField = (field, isGroup) => {
    const selector = `[data-testid="input-${field.fieldName}"]`;
    switch (field.type) {
        case 'text':
            typeIntoElement(selector, field.fieldName === 'customer_name' ? faker.person.firstName() : 'Test Value text');
            break;
        case 'textarea':
            typeIntoElement(selector, field.fieldName === 'address_detail' ? faker.location.streetAddress({ useFullAddress: true }) : 'Test Value textarea');
            break;
        case 'number':
            typeIntoElement(selector, faker.number.int({ min: 100, max: 1000 }).toString());
            break;
        case 'datetime':
            const formattedDate = dayjs(faker.date.soon(7)).format('MM/DD/YYYY, HH:mm');
            typeIntoElement(selector, formattedDate);
            clickElement('[data-test="select-button"]');
            break;
        case 'select':
            clickElement(selector);
            cy.get('.multiselect__option').contains(getRandomOptions(field.options)).click();
            break;
        case 'multiselect':
            clickElement(selector);
            getRandomOptions(field.options, 2).forEach(option => {
                cy.get('.multiselect__option').contains(option).click();
            });
            break;
        default:
            if (field.fieldName === 'is_group_task' && isGroup) {
                clickElement(selector);
            }
    }
};

const fillForm = ({ isGroup = false } = {}) => {
    cy.get('#schema-container').then(($el) => {
        const schema = JSON.parse($el.attr('data-schema'));
        schema.forEach((field) => fillField(field, isGroup));
    });
};

const submitForm = () => {
    clickElement('[data-testid="button-submit"]');
    waitForRequest(['@createTask', '@keepData']);
    return cy.wait('@linkCore').then((interception) => interception.response.body.message);
};



export const taskCreationPage = {
    setUpInterceptCreate: () => {
        interceptReqCreatePage();
        interceptReqListPage();
    },
    goToCreatePage: () => {
        goToPage('/create-task');
        cy.wait('@getFirstStatus').then(() => {
            cy.wait('@getSchema');
        });
    },
    fillForm,
    submitForm,
};
import { goToPage } from "./basePageFunction";


export const LoginUser = ({ usr, pwd }) => {
    goToPage('/login');
    cy.wait(2000);
    cy.get('#login_email').type(usr);
    cy.get('#login_password').type(pwd);
    cy.contains('button', 'Login').click().wait(2000);

}

// export const checkAndLogout = () => {
//     cy.getCookie('user_id').then((cookie) => {
//         if (cookie && cookie.value !== 'Guest') {
//             cy.logout();
//         }
//     });
// };
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/task-list',
        name: 'Home',
        component: () => import('@/pages/Home.vue'),
    },
    // {
    //     path: '/create-task',
    //     name: 'Create',
    //     component: () => import('@/pages/Create.vue'),
    // },
    // {
    //     path: '/detail-task/:status/:core_id',
    //     name: 'DetailTask',
    //     component: () => import('@/pages/DetailTask.vue'),
    // },
    // {
    //     path: '/detail-group/:group_id',
    //     name: 'DetailGroup',
    //     component: () => import('@/pages/DetailGroup.vue'),
    // },
    // {
    //     path: '/test-form',
    //     name: 'TestForm',
    //     component: () => import('@/pages/TestForm.vue'),
    // },
    // {
    //     path: '/test-e2e',
    //     name: 'TestE2E',
    //     component: () => import('@/pages/Teste2e.vue'),
    // },
    // {
    //   path: '/login',
    //   name: 'Login',
    //   component: () => import('@/pages/Login.vue'),
    // },
    // {
    //   path: '/register',
    //   name: 'Register',
    //   component: () => import('@/pages/Register.vue'),
    // },
]

let router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router

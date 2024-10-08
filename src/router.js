import { createRouter, createWebHistory } from 'vue-router'

import Home from './pages/Home.vue'
import Create from './pages/Create.vue'
import DetailTask from './pages/DetailTask.vue'
import DetailGroup from './pages/DetailGroup.vue'


export const router = createRouter({
    history: createWebHistory("/dcraft"),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home,
        },
        {
            path: '/create-task',
            name: 'Create',
            component: Create,
        },
        {
            path: '/detail-task/:status/:core_id',
            name: 'DetailTask',
            component: DetailTask,
        },
        {
            path: '/detail-group/:group_id',
            name: 'DetailGroup',
            component: DetailGroup
        },
    ],
})


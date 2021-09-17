import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/auth',
        name: "Auth",
        component: () => import(/* webpackChunkName: "auth" */ '../views/Auth.vue')

    },
    {
        path: '/',
        name: 'Index',
        component: () => import(/* webpackChunkName: "index" */ '../views/Index.vue')
    },
    {
        path: '/view-all',
        name: "All records",
        component: () => import(/* webpackChunkName: "viewall" */ '../views/ViewAll.vue')
    },
    {
        path: '/record/:id/view',
        name: "View record",
        component: () => import(/* webpackChunkName: "viewrecord" */ '../views/ViewRecord.vue')
    },
    {
        path: '/record/add',
        name: "Add record",
        component: () => import(/* webpackChunkName: "addrecord" */ '../views/AddRecord.vue')
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router

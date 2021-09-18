import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/auth',
        name: "Auth",
        component: () => import(/* webpackChunkName: "auth" */ '../views/Auth.vue'),
        meta: {
            title: "Авторизация"
        }
    },
    {
        path: '/',
        name: 'Index',
        component: () => import(/* webpackChunkName: "index" */ '../views/Index.vue'),
        meta: {
            title: "Главная страница"
        }
    },
    {
        path: '/view-all',
        name: "All records",
        component: () => import(/* webpackChunkName: "viewall" */ '../views/ViewAll.vue'),
        meta: {
            title: "Просмотр всех записей"
        }
    },
    {
        path: '/record/:id/view',
        name: "View record",
        component: () => import(/* webpackChunkName: "viewrecord" */ '../views/ViewRecord.vue'),
        meta: {
            title: "Просмотр записи"
        }
    },
    {
        path: '/record/add',
        name: "Add record",
        component: () => import(/* webpackChunkName: "addrecord" */ '../views/AddRecord.vue'),
        meta: {
            title: "Добавление записи"
        }
    },
    {
        path: "/:pathMatch(.*)*",
        name: "404",
        component: () => import(/* webpackChunkName: "404" */ '../views/404.vue'),
        meta: {
            title: "404"
        }
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router

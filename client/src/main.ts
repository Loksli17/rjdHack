import { createApp } from 'vue';
import App           from './App.vue';
import router        from './router';
import store         from './store';

const DEFAULT_TITLE = "NO TITLE";

router.beforeEach((to, from, next) => {
    document.title = to.meta.title as string ?? DEFAULT_TITLE;
    next();
})

createApp(App).use(store).use(router).mount('#app')

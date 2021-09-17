import axios                                from 'axios';
import { createApp }                        from 'vue';
import FlashMessage, { FlashMessagePlugin } from '@smartweb/vue-flash-message';
import App                                  from './App.vue';
import router                               from './router';
import store                                from './store';
import Menu                                 from './components/Menu.vue';

const DEFAULT_TITLE = "NO TITLE";

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        $flashMessage: FlashMessagePlugin
    }
}

router.beforeEach((to, from, next) => {
    document.title = to.meta.title as string ?? DEFAULT_TITLE;
    next();
});

axios.defaults.baseURL = 'http://localhost:3000/';

const app = createApp(App);

app.component('Menu', Menu);
app.use(FlashMessage);

app.use(store).use(router).mount('#app')

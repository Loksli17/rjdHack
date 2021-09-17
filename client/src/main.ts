import axios                                from 'axios';
import { createApp }                        from 'vue';
import FlashMessage, { FlashMessagePlugin } from '@smartweb/vue-flash-message';
import App                                  from './App.vue';
import router                               from './router';
import store                                from './store';
import Menu                                 from './components/Menu.vue';
import moment                               from 'moment';

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


const filters = {
    upperFirst: function(str: string){
        return str[0].toUpperCase() + (str.slice(1, (str.length)));
    },
    datetimeToDb: function(date: Date | string){
        return moment(date).format('YYYY-MM-DD hh:mm:ss');
    },
    datetimeToView: function(date: Date | string){
        return moment(date).format('D.MM.YY h:mm a');
    },
    datetimeToViewMessage: function(date: Date | string){
        return moment(date).format('h:mm a D MMMM');
    },
    dateToDb: function(date: Date | string){
        return moment(date).format('YYYY-MM-DD');
    },
    dateToView: function(date: Date | string){
        return moment(date).format('MMMM Do YYYY');
    },
    timeToDb: function(date: Date | string){
        return moment(date).format('hh:mm:ss');
    },
    timeToView: function(date: Date | string){
        return moment(date).format('h:mm a');
    }
}

app.use(store).use(router).mount('#app');

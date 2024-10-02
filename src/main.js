import './style.css'
import { createApp } from 'vue'
import { router } from './router'
import App from './App.vue'
import { setConfig, frappeRequest, resourcesPlugin } from 'frappe-ui'
import 'vue-multiselect/dist/vue-multiselect.css';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

let app = createApp(App)
setConfig('resourceFetcher', frappeRequest)
app.use(router)
app.use(resourcesPlugin)
app.component('VueDatePicker', VueDatePicker);
app.mount('#app')

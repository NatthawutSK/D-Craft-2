import { createApp } from 'vue'
import './style.css'
import router from './router'
import App from './App.vue'
import { setConfig, frappeRequest, resourcesPlugin } from 'frappe-ui'

let app = createApp(App)
setConfig('resourceFetcher', frappeRequest)

app.use(router)
app.use(resourcesPlugin)

app.mount('#app')

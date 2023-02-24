import { createApp } from 'vue'
import App from './App.vue'

import BootstrapVue3 from 'bootstrap-vue-3'

import {createRouter, createWebHashHistory} from 'vue-router'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'

import mitt from 'mitt';

import Home from "./components/Home.vue"
import Mode from "./components/Mode.vue"
import Main from "./components/Main.vue"
import Prova2 from "./components/Prova2.vue"

const emitter = mitt();  

const routes = [
    { path: '/', component: Home },
    { path: '/mode', component: Mode },
    { path: '/main/:mode', component: Main },
    { path: '/prova', component: Prova2 },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes, // short for `routes: routes`
  })

const app = createApp(App)
app.use(BootstrapVue3)
app.use(router)
app.provide('emitter', emitter);
app.mount('#app')

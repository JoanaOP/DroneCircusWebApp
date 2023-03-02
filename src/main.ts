import { createApp } from 'vue'
import App from './App.vue'

import BootstrapVue3 from 'bootstrap-vue-3'

import {createRouter, createWebHashHistory} from 'vue-router'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'

import mitt from 'mitt';

import mqtt, { MqttClient } from 'mqtt'

import Home from "./components/Home.vue"
import Mode from "./components/Mode.vue"
import Main from "./components/Main.vue"

const emitter = mitt();  

const routes = [
    { path: '/', component: Home },
    { path: '/mode', component: Mode },
    { path: '/main/:mode', component: Main }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes, // short for `routes: routes`
  })

const app = createApp(App)

let client: MqttClient
try{
    client = mqtt.connect('ws://broker.hivemq.com:8000/mqtt') //proba a connectar-se
    client.on('connect', () => { //si el commando que rep es 'connect', s'ha connectat bé
        console.log("Connection succeeded!");
        app.provide('mqttClient', client); // com s'ha connectet proveim el client als altres components pk el puguin utilitzar
    })
}
catch(error){
    console.log("mqtt.connect error ", error);
}

app.use(BootstrapVue3)
app.use(router)
app.provide('emitter', emitter);
app.mount('#app')

<template>
    <div style="background-color: #EDF4F2; display: flex; padding-top: 15px; height: auto;">
        <div style="padding-left: 5%; width: 40%;">
            <div>
                <router-link to="/mode" custom v-slot="{ navigate }">
                    <Buttons @close="navigate" @selectLevel="showLevelSelector" @practice="practice" @connect="selectConnectionMode"></Buttons>
                </router-link>                
            </div>
            <div>
                <Instructions></Instructions>
            </div>        
        </div>
        <div style="width: 60%">
            <div style="padding=5%">
                <Map></Map>
            </div>
            <div> 
                <Detector></Detector>
            </div>
        </div>
        <LevelSelector v-if="levelSelectorShowing" @close="levelSelectorShowing=false"></LevelSelector>
        <ConnectionMode v-if="connectionModeSelectorShowing" @close="connectionModeSelectorShowing=false"></ConnectionMode>
    </div>    
</template>

<script>
import { defineComponent, ref, inject, onMounted, provide } from 'vue'
import { useRoute } from 'vue-router'
import Instructions from './Instructions.vue'
import Buttons from './Buttons.vue'
import Map from './Map.vue'
import Detector from './Detector.vue'
import LevelSelector from './LevelSelector.vue'
import ConnectionMode from './ConnectionMode.vue'
import mqtt, { MqttClient } from 'mqtt'

export default defineComponent({
    components: {
        Instructions,
        Buttons,
        Map,
        Detector,
        LevelSelector,
        ConnectionMode
    },
    setup () {

        const route = useRoute()

        const emitter = inject('emitter');
        let client = inject('mqttClient');

        let levelSelectorShowing = ref(false)
        let connectionModeSelectorShowing = ref(false)
        let selectedLevel = ref("")
        let difficulty = ref("")
        let mode = ref("")  
        let connectionMode = ref("");
        
        
        emitter.on('selectedLevel', (data) => {
            selectedLevel.value = data.level;                       
        })

        emitter.on('difficulty', (data) => {
            difficulty.value = data.level;                      
        })

        emitter.on('selectedConnection', (data) => {
            connectionMode.value = data.mode;
            let external_broker_address;         
            if(connectionMode.value == "Global"){
                external_broker_address = "localhost"
            }
            else if(connectionMode.value == "Local"){
                external_broker_address = "10.10.10.1"
            }
            let port = 8000;            
            try{
                let clientAutopilot = mqtt.connect('mqtt://'+external_broker_address+':'+port) //proba a connectar-se
                clientAutopilot.on('connect', () => { //si el commando que rep es 'connect', s'ha connectat bé
                    console.log("Connection autopilot succeeded!");
                    provide('mqttClientAutopilot', clientAutopilot); // com s'ha connectet proveim el client als altres components pk el puguin utilitzar
                })
            }
            catch(error){
                console.log("mqtt.connect error ", error);
            }            
        })

        onMounted(() => {
            mode.value = route.params.mode;
            console.log(mode.value)
            client.publish("droneCircusWebApp/imageService/Connect","");   
        })

        function showLevelSelector(){
            levelSelectorShowing.value = true;            
        }

        function practice(){
            const parameters = {
                mode: mode.value,
                level: difficulty.value,
                selected_level: selectedLevel.value
            }
            let message = JSON.stringify(parameters);
            client.publish("droneCircusWebApp/imageService/parameters", message);
            client.subscribe("imageService/droneCircusWebApp/videoFrame")
            client.subscribe("imageService/droneCircusWebApp/code")
            emitter.emit('videoCapture',  {'capturing':true});
        }

        function selectConnectionMode(){
            connectionModeSelectorShowing.value = true;
        }
        
        return {
            showLevelSelector,
            levelSelectorShowing,
            selectedLevel,
            difficulty,
            practice,
            selectConnectionMode,
            connectionModeSelectorShowing
        }
    }
})
</script>

<style scoped>

</style>
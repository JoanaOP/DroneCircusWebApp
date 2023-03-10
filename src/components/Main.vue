<template>
    <div style="background-color: #EDF4F2; display: flex; padding-top: 15px; height: auto;">
        <div style="padding-left: 5%; width: 40%;">
            <div>
                <Buttons @close="close" @selectLevel="showLevelSelector" @practice="practice" @connect="selectConnectionMode" @stopPractice="state = 'disconnected'" @arm="arm" @takeoff="takeoff" @returnHome="returnHome" @disconnect="disconnect"></Buttons>
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
import { useRoute, useRouter } from 'vue-router'
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
        const router = useRouter()

        const emitter = inject('emitter');
        let client = inject('mqttClient');
        let clientAutopilot;

        let levelSelectorShowing = ref(false)
        let connectionModeSelectorShowing = ref(false)
        let selectedLevel = ref("")
        let difficulty = ref("")
        let mode = ref("")  
        let connectionMode = ref("");

        let state = ref("idle");
        
        
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
            createClient(external_broker_address, port);
        })
        
        emitter.on('direction', (data) => {
            if(state.value != "returning"){
                if(data.direction == "Drop"){
                    clientAutopilot.publish('droneCircusWebApp/autopilotService/drop');
                    clientAutopilot.publish('droneCircusWebApp/autopilotService/reset');
                }
                else if(data.direction == "Return"){
                    returnHome();
                }
                else{
                    clientAutopilot.publish('droneCircusWebApp/autopilotService/go', data.direction);                
                }
            }
        })

        onMounted(() => {
            mode.value = route.params.mode;
            console.log(mode.value);
            client.publish("droneCircusWebApp/imageService/Connect","");
        })

        function showLevelSelector(){
            levelSelectorShowing.value = true;            
        }

        function practice(){
            state.value = "practising";
            const parameters = {
                mode: mode.value,
                level: difficulty.value,
                selected_level: selectedLevel.value
            }
            let message = JSON.stringify(parameters);
            client.publish("droneCircusWebApp/imageService/parameters", message);
            client.subscribe("imageService/droneCircusWebApp/videoFrame")
            client.subscribe("imageService/droneCircusWebApp/code")            
            emitter.emit('videoCapture',  {'capturing':true, 'state': state.value});  
        }

        function selectConnectionMode(){
            connectionModeSelectorShowing.value = true;
        }

        function createClient(external_broker_address, port){
            try{
                clientAutopilot = mqtt.connect('mqtt://'+external_broker_address+':'+port) //proba a connectar-se
                clientAutopilot.on('connect', () => { //si el commando que rep es 'connect', s'ha connectat bé
                    console.log("Connection autopilot succeeded!");
                })
                clientAutopilot.publish("droneCircusWebApp/autopilotService/connect");
                clientAutopilot.subscribe("autopilotService/droneCircusWebApp/#");

                clientAutopilot.on('message', (topic,message) => {
                    console.log(topic)
                    if(topic=="autopilotService/droneCircusWebApp/telemetryInfo"){
                        let telemetryInfo = JSON.parse(message);
                        let stateAutopilot = telemetryInfo.state;
                        let lat = telemetryInfo.lat;
                        let long = telemetryInfo.lon;
                        if (stateAutopilot == "connected" && state.value == "disconnected"){                            
                            state.value = "connected";
                            emitter.emit('autopilotState', {'state': state.value});
                            emitter.emit('autopilotPosition',{'lat': lat, 'long': long});                                                  
                        }
                        else if(stateAutopilot == "armed" && state.value == "connected"){
                            console.log("armed");
                            state.value = "armed";
                            emitter.emit('autopilotState', {'state': state.value});
                        }
                        else if(stateAutopilot == "flying" && state.value != "flying"){
                            state.value = "flying";
                            emitter.emit('autopilotState', {'state': state.value})
                            emitter.emit('videoCapture',  {'capturing':true, 'state': state.value});
                        }
                        else if(stateAutopilot == "flying" && state.value == "flying"){
                            emitter.emit('autopilotPosition',{'lat': lat, 'long': long});  
                        }
                        else if(stateAutopilot == "returningHome" && state.value == "flying"){                            
                            state.value = "returning";
                            emitter.emit('autopilotPosition',{'lat': lat, 'long': long});
                            emitter.emit('autopilotState', {'state': state.value});
                            emitter.emit('videoCapture',  {'capturing':false, 'state': state.value});
                        }
                        else if(stateAutopilot == "returningHome" && state.value == "returning"){
                            emitter.emit('autopilotPosition',{'lat': lat, 'long': long});
                            emitter.emit('autopilotState', {'state': state.value});
                        }
                        else if(stateAutopilot == "onHearth" && state.value == "returning"){
                            state.value = "onHearth";
                            emitter.emit('autopilotState', {'state': state.value});
                        }
                    }
                })                
            }
            catch(error){
                console.log("mqtt.connect error ", error);
            }            
        }

        function arm(){
            clientAutopilot.publish("droneCircusWebApp/autopilotService/armDrone");
        }

        function takeoff(){
            clientAutopilot.publish("droneCircusWebApp/autopilotService/takeOff");
        }

        function returnHome(){
            clientAutopilot.publish("droneCircusWebApp/autopilotService/returnToLaunch");
        }

        function disconnect(){
            clientAutopilot.publish("droneCircusWebApp/autopilotService/disconnect");
        }

        function close(){
            router.push('/mode');
            if(state.value == 'connected'){                
                clientAutopilot.end()
            }
        }
        
        return {
            showLevelSelector,
            levelSelectorShowing,
            selectedLevel,
            difficulty,
            practice,
            selectConnectionMode,
            connectionModeSelectorShowing,
            state,
            close,
            arm,
            takeoff,
            returnHome,
            disconnect
        }
    }
})
</script>

<style scoped>

</style>
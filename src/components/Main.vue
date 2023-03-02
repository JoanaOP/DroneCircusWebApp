<template>
    <div style="background-color: #EDF4F2; display: flex; padding-top: 15px; height: auto;">
        <div style="padding-left: 5%; width: 40%;">
            <div>
                <router-link to="/mode" custom v-slot="{ navigate }">
                    <Buttons @close="navigate" @selectLevel="showLevelSelector" @practice="practice"></Buttons>
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
    </div>    
</template>

<script>
import { defineComponent, ref, inject, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Instructions from './Instructions.vue'
import Buttons from './Buttons.vue'
import Map from './Map.vue'
import Detector from './Detector.vue'
import LevelSelector from './LevelSelector.vue'

export default defineComponent({
    components: {
        Instructions,
        Buttons,
        Map,
        Detector,
        LevelSelector,
    },
    setup () {

        const route = useRoute()

        const emitter = inject('emitter');
        let client = inject('mqttClient');

        let levelSelectorShowing = ref(false)
        let selectedLevel = ref("")
        let difficulty = ref("")
        let mode = ref("")  
        
        emitter.on ('selectedLevel', (level) => {
            selectedLevel.value = level;           
        })

        emitter.on ('difficulty', (level) => {
            difficulty.value = level;                      
        })

        onMounted(() => {
            mode.value = route.params.mode;
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
            emitter.emit('videoCapture',  {'capturing':true});
        }
        
        return {
            showLevelSelector,
            levelSelectorShowing,
            selectedLevel,
            difficulty,
            practice
        }
    }
})
</script>

<style scoped>

</style>
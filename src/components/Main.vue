<template>
    <div style="background-color: #EDF4F2; display: flex; padding-top: 15px;">
        <div style="padding-left: 5%; width: 40%;">
            <div>
                <router-link to="/mode" custom v-slot="{ navigate }">
                    <Buttons @close="navigate"></Buttons>
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
    </div>    
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Instructions from './Instructions.vue'
import Buttons from './Buttons.vue'
import Map from './Map.vue'
import Detector from './Detector.vue'

export default defineComponent({
    components: {
        Instructions,
        Buttons,
        Map,
        Detector
    },
    setup () {
        
        return {}
    }
})
</script>

<style scoped>

</style>
<template>
    <div>
        <img v-bind:src="modeUrl">
    </div>
</template>

<script>
import { defineComponent, ref, onMounted, inject } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({    
    setup () {
        const route = useRoute()
        let modeUrl = ref("")
        let difficulty = ref("")
        let mode = ref("")

        onMounted(() => {
            mode.value = route.params.mode;
        })

        const emitter = inject('emitter');

        emitter.on ('difficulty', (level) => {
            difficulty.value = level;

            if(mode.value == "fingers"){
                modeUrl.value = require("../assets/dedos_faciles.png")                               
            }
            else if(mode.value == "faces"){                
                modeUrl.value = require("../assets/caras_faciles.png")
            }
            else if(mode.value == "figures"){
                if(difficulty.value == "easy"){
                    modeUrl.value = require("../assets/poses_faciles.png")
                }
                else if(difficulty.value == "difficult"){
                    modeUrl.value = require("../assets/poses_dificiles.png")
                }
            }
            else{
                if(difficulty.value == "easy"){
                    modeUrl.value = require("../assets/voces_faciles.png")
                }
                else if(difficulty.value == "difficult"){
                    modeUrl.value = require("../assets/voces_dificiles.png")
                }                
            }                      
        })

        return {
            modeUrl,
            difficulty
        }
    }
})
</script>

<style scoped>
    img {
        max-width: 100%;
        max-height: 100%;
    }
</style>
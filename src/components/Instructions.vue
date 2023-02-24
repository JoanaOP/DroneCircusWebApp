<template>
    <div>
        <img v-bind:src="modeUrl">
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({    
    setup () {
        const route = useRoute()
        let modeUrl = ref("")

        onMounted(() => {
            if(route.params.mode == "fingers"){
                modeUrl.value = require("../assets/dedos_faciles.png")
            }
            else if(route.params.mode == "faces"){
                modeUrl.value = require("../assets/caras_faciles.png")
            }
            else if(route.params.mode == "figures"){
                modeUrl.value = require("../assets/poses_faciles.png")
            }
            else{
                modeUrl.value = require("../assets/voces_faciles.png")
            }
        })

        return {
            modeUrl
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
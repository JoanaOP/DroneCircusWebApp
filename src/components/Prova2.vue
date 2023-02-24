<template>
    <div>
        <Prova @picture-taken="imageSrc = $event"></Prova>
        <img :src="imageSrc">
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Prova from './Prova.vue'

export default defineComponent({

    components: {
        Prova
    },
    setup () {
        
        let imageSrc = ref("")
        return {
            imageSrc
        }
    }
})
</script>

<style scoped>

</style>
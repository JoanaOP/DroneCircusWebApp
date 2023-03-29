<template>
    <div>
        <VideoCapture></VideoCapture>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import VideoCapture from './VideoCapture.vue'

export default defineComponent({
    components:{
        VideoCapture
    },

    setup () {        

        return {}
    }
})
</script>

<style scoped>

</style>
<template>
    <div>
        <VideoDisplay></VideoDisplay>
        <VideoCapture></VideoCapture>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import VideoDisplay from './VideoDisplay.vue'
import VideoCapture from './VideoCapture.vue'

export default defineComponent({
    components:{
        VideoDisplay,
        VideoCapture
    },
    setup () {        

        return {}
    }
})
</script>

<style scoped>

</style>
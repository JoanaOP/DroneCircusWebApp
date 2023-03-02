<template>
    <div style="background-color: blue;">
        <video ref="video" @canplay="initCanvas()" style="display:none"></video>
        <canvas ref="canvas" style="display:none" id= "output"></canvas>
    </div>
</template>

<script>
import { defineComponent, inject } from 'vue'

export default defineComponent({
    mounted(){
        this.video = this.$refs.video
        this.canvas = this.$refs.canvas
        this.emitter.on('videoCapture', (cap) => {
            if(cap.capturing){
                this.startCapture();
            }
            else if(!cap.capturing){
                this.stopCapture();
            }
        })
    },
    methods:{
        startCapture() {            
            navigator.mediaDevices.getUserMedia({ video: true, audio: false}).then(stream => {
                if(this.video){
                    this.stream = stream;
                    this.video.srcObject = this.stream;
                    this.video.play()
                }               
                
            }).catch(error => {
                console.log(error);
            })
        },
        initCanvas(){
            this.canvas.setAttribute('width', 800)
            this.canvas.setAttribute('height', 600)
            this.interval = setInterval(() => {
                let context = this.canvas.getContext('2d');
                context.drawImage(this.video, 0,0, 800, 600);
                let jpg_as_text = this.canvas.toDataURL("image/jpeg").split(';base64,')[1];                
                this.client.publish("droneCircusWebApp/imageService/videoFrame",jpg_as_text);
            }, 300);
        },
        stopCapture(){
            this.stream.getTracks().forEach(function(track) {
                track.stop();
            });
            clearInterval(this.interval)
        }        
    },
    data() {        
        return{
            video: null,
            canvas: null,
            capturing: false,
            stream: null,
            interval: null
        }
    }, 
    setup () {

        let client = inject('mqttClient');
        let emitter = inject('emitter')

        return {
            client,
            emitter
        }
    }
})
</script>

<style scoped>

</style>
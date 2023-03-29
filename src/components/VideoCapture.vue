<template>    
    <div class="leftStyle">        
        <div style="display:flex; justify-content: center;">
            <div  style ="width:70%; height:350px display: flex; justify-content: center;">
                <canvas ref="canvasOut" style="width: 400px; height: 300px; border-style: solid;" id="output"></canvas>
                <!-- <img style="width: 400px; height: 300px; border-style: solid;" :src="imageList[indexToShow]" > -->
            </div>
       </div>
    </div>
    <div style="background-color: blue;">
        <video ref="video" @canplay="initCanvas()" style="display:none"></video>
        <canvas ref="canvas" style="display:none"></canvas>
    </div>
</template>

<script>
import { defineComponent, inject, ref } from 'vue'
import * as cv from 'opencv.js'

export default defineComponent({
    mounted(){
        this.video = this.$refs.video
        this.canvas = this.$refs.canvas
        this.canvasOut = this.$refs.canvasOut
        this.emitter.on('videoCapture', (cap) => {
            if(cap.capturing){
                this.startCapture();
            }
            else if(!cap.capturing){
                this.stopCapture();
            }
        })

        this.client.on('message', (topic,message) =>{
            if(topic == "imageService/droneCircusWebApp/videoFrame"){
                let data = JSON.parse(message);
                let landmarksJSON = data.landmarks;
                this.indexToShow = parseInt(data.index);  
                this.showImage(this.indexToShow)              
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
            this.canvas.setAttribute('width', 400)
            this.canvas.setAttribute('height', 300)
            let index = 0;
            this.interval = setInterval(() => {
                let context = this.canvas.getContext('2d');
                context.drawImage(this.video, 0,0, 400, 300);
                let jpg_as_text = this.canvas.toDataURL("image/jpeg").split(';base64,')[1];                 
                let data = {
                    "image": jpg_as_text,
                    "index": index
                }
                index = index + 1;
                let dataJSON = JSON.stringify(data);
                this.client.publish("droneCircusWebApp/imageService/videoFrame",dataJSON);
                this.client.subscribe("imageService/droneCircusWebApp/videoFrame");
                this.imageList.push(this.canvas.toDataURL("image/jpeg"));                
            }, 500);
        },
        stopCapture(){
            this.stream.getTracks().forEach(function(track) {
                track.stop();
            });
            clearInterval(this.interval);
            this.client.publish("droneCircusWebApp/imageService/stopVideoStream");
        },
        
        showImage(index) {   
            const img = new Image();        
            img.src = this.imageList[index];
            console.log(img.src)
            img.onload = () => {
                let dst;
                dst = cv.imread (img);
                cv.imshow ('output',dst);
            }
        },    
        
    },
    data() {        
        return{
            video: null,
            canvas: null,
            capturing: false,
            stream: null,
            interval: null,
            imageList: [],
            indexToShow: 0            
        }
    }, 

    setup () {

        let client = inject('mqttClient');
        let emitter = inject('emitter');     

        return {
            client,
            emitter
        }
    }
})
</script>

<style scoped>

.leftStyle{
        width: 100%;
    }

</style>
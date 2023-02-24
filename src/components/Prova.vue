<template>
    <div>
        <video ref="video" @canplay="initCanvas()" style="display:none"></video>
        <button>Take Picture</button>
        <canvas ref="canvas" style="display:none" id= "output"></canvas>
    </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
    mounted(){
        this.video = this.$refs.video
        this.canvas = this.$refs.canvas
        this.startCapture()
    },
    methods:{
        startCapture() {
            navigator.mediaDevices.getUserMedia({ video: true, audio: false}).then(stream => {
                if(this.video){
                    this.video.srcObject = stream;
                    this.video.play()
                    // const img = new Image();
                    // img.src = "data:image/jpg;base64,"+this.video;
                   
                    // img.onload = () => {     
                    //     context.drawImage(
                    //         img,
                    //         0,
                    //         0,
                    //         img.width,
                    //         img.height,
                    //         0,
                    //         0,
                    //         this.canvas.width,
                    //         this.canvas.height
                    //     );  
                    // };
                    
                    
                }               
                
            }).catch(error => {
                console.log(error);
            })
        },
        initCanvas(){
            this.canvas.setAttribute('width', this.video.videoWidth)
            this.canvas.setAttribute('height', this.video.videoHeight)
            setInterval(() => {
                let context = this.canvas.getContext('2d');
                context.drawImage(this.video,0,0, this.video.videoWidth, this.video.videoHeight);
                this.$emit('picture-taken',this.canvas.toDataURL('image/jpg'))
            }, 300);
        },
        // takePicture(){
            
        // }
    },
    data() {
        return{
            video: null,
            canvas: null
        }
    },    
    setup () {

        return {
            
        }
    }
})
</script>

<style scoped>

</style>
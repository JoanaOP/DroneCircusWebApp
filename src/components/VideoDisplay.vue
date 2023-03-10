<template>
    <div class="leftStyle">        
        <div style="display:flex; justify-content: center;">
            <div  style ="width:70%; display: flex; justify-content: center;">
                <canvas style="width: 400px; height: 300px; border-style: solid;" id= "output"></canvas>
            </div>
       </div>
    </div>
</template>

<script>
import { defineComponent, inject, onMounted } from 'vue'
import * as cv from 'opencv.js'

export default defineComponent({

    setup () {
        let client = inject("mqttClient");  
        let cont = 0;

        function showImage(message){
            cont = cont + 1;
            console.log("frames "+cont);
            const img = new Image();
            img.src = "data:image/jpg;base64,"+message; //objecte tipo Image on li coloquem la imatge rebuda pel payload, el tag es per identificar el tipus de imatge
            img.onload = () => {       
                let dst;
                dst = cv.imread (img);                        
                cv.imshow ('output',dst); // coloca la imatge al canvas, el mateix que feiem abans pero amb opencv
            }
        }
        
        onMounted(() => {
            client.on('message', (topic,message) => {
                if(topic=="imageService/droneCircusWebApp/videoFrame"){
                    showImage(message)
                }
            });
        })        

        return {
            client
        }
    }
})
</script>

<style scoped>
    .leftStyle{
        width: 100%;
    }
</style>
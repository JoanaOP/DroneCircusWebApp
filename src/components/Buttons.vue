<template>
    <div>
        <div class="row">
            <div class="col" style="text-align: center;">
                <b-button @click="easyClicked" class="button" v-model="easyColor" :style="{backgroundColor: easyColor }">Easy</b-button>
            </div>
            <div class="col" style="text-align: center;">
                <b-button @click="difficultClicked" class="button" v-model="difficultColor" :style="{backgroundColor: difficultColor }" style="">Difficult</b-button>
            </div>
        </div>
        <div class="row" style="">
            <div class="col" style="text-align: center;">
                <b-button class="button" style="">Select scenario</b-button>
            </div>
        </div>
        <div class="row" style="">
            <div class="col-8" style="text-align: center;">
                <b-button class="button" style="">Practice</b-button>
            </div>
            <div class="col-4" style="text-align: center;">
                <b-button @click="close" class="button" style="background-color: #D2001A; border-color: #D2001A;">Close</b-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
    setup (props, context) {

        let difficultySelected = ref(false);
        let easyColor = ref("gray")
        let difficultColor = ref("gray")
        let difficulty = ref("")
        
        function close(){
            context.emit('close'); // el context es passa com a parametre del setup
        }

        function easyClicked(){
            if(difficultySelected.value == true){
                difficultColor.value = "gray"
            }            
            easyColor.value = "#61AE4A";
            difficulty.value = "easy";
            difficultySelected.value = true;
        }

        function difficultClicked(){
            if(difficultySelected.value == true){
                easyColor.value = "gray"
            }            
            difficultColor.value = "#61AE4A";
            difficulty.value = "difficult";
            difficultySelected.value = true;
        }

        return {
            close,
            easyClicked,
            difficultClicked,
            easyColor,
            difficulty,
            difficultySelected,
            difficultColor
        }
    }
})
</script>

<style scoped>
.row{
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
}
.button{
    width:100%;
    height: 100%;
    font-size: 15px;
    font-weight: bold;
    font-family: monospace;
    border: none;
}
</style>
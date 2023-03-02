<template>
    <div>
        <div class="row">
            <div class="col" style="text-align: center;">
                <b-button @click="easyClicked" class="button" v-model="easyColor" :style="{backgroundColor: easyColor }">Easy</b-button>
            </div>
            <div class="col" style="text-align: center;">
                <b-button @click="difficultClicked" class="button" v-model="difficultColor" :style="{backgroundColor: difficultColor }">Difficult</b-button>
            </div>
        </div>
        <div class="row" style="">
            <div class="col" style="text-align: center;">
                <b-button @click="selectScenarioClicked" class="button" :disabled="selectScenarioDisabled" :style="{backgroundColor: selectLevelColor }">Select scenario</b-button>
            </div>
        </div>
        <div class="row" style="">
            <div class="col-8" style="text-align: center;">
                <b-button @click="startPractice" class="button" :disabled="practiceButtonDisabled" style="background-color: gray;">Practice</b-button>
            </div>
            <div class="col-4" style="text-align: center;">
                <b-button @click="close" class="button" style="background-color: #D2001A; border-color: #D2001A;">Close</b-button>
            </div>
        </div>

    </div>
</template>

<script>
import { defineComponent, ref, inject } from 'vue'

export default defineComponent({
    
    setup (props, context) {

        const emitter = inject('emitter');

        let difficultySelected = ref(false);
        let easyColor = ref("gray");
        let difficultColor = ref("gray");
        let selectScenarioDisabled = ref(true);
        let practiceButtonDisabled = ref(true);
        let showLevelSelector = ref(false);
        let selectLevelColor = ref("gray")
        
        function close(){
            context.emit('close'); // el context es passa com a parametre del setup
            emitter.emit('videoCapture', {'capturing':false})
        }

        function easyClicked(){
            if(difficultySelected.value == true){
                difficultColor.value = "gray"
            }            
            easyColor.value = "#61AE4A";
            difficultySelected.value = true;
            selectScenarioDisabled.value = false;
            emitter.emit('difficulty',{'level':'easy'});
        }

        function difficultClicked(){
            if(difficultySelected.value == true){
                easyColor.value = "gray"
            }            
            difficultColor.value = "#61AE4A";
            difficultySelected.value = true;
            selectScenarioDisabled.value = false;
            emitter.emit('difficulty', {'level':'difficult'});
        }

        function selectScenarioClicked(){            
            context.emit('selectLevel');
            practiceButtonDisabled.value = false;
            selectLevelColor.value = "#61AE4A";
        }

        function startPractice(){
            context.emit('practice');
        }

        return {
            close,
            easyClicked,
            difficultClicked,
            selectScenarioClicked,
            easyColor,
            difficultySelected,
            difficultColor,
            selectScenarioDisabled,
            practiceButtonDisabled,
            showLevelSelector,
            selectLevelColor,
            startPractice
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
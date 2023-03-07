<template>
    <div>
        <div class="row">
            <div class="col" style="text-align: center;">
                <b-button @click="easyClicked" class="button" v-model="easyColor" :disabled="easyDisabled" :style="{backgroundColor: easyColor }">Easy</b-button>
            </div>
            <div class="col" style="text-align: center;">
                <b-button @click="difficultClicked" class="button" v-model="difficultColor" :disabled="difficultDisabled" :style="{backgroundColor: difficultColor }">Difficult</b-button>
            </div>
        </div>
        <div v-if="!showingFlyingButtons" class="row" style="">
            <div class="col" style="text-align: center;">
                <b-button @click="selectScenarioClicked" class="button" :disabled="selectScenarioDisabled" :style="{backgroundColor: selectLevelColor }">Select scenario</b-button>
            </div>
        </div>
        <div v-if="showingFlyingButtons" class="row" style="">
            <div class="col" style="text-align: center;">
                <b-button @click="connectClick" class="button" :disabled="connectDisabled" :style="{backgroundColor: connectColor }">{{ connectText }}</b-button>
            </div>
            <div class="col" style="text-align: center;">
                <b-button @click="armClick" class="button" :disabled="armDisabled" :style="{backgroundColor: armColor }">{{ armText }}</b-button>
            </div>
            <div class="col" style="text-align: center;">
                <b-button @click="takeoffClick" class="button" :disabled="takeoffDisabled" :style="{backgroundColor: takeoffColor }">{{ takeoffText }}</b-button>
            </div>
        </div>
        <div class="row" style="">
            <div class="col-8" style="text-align: center;">
                <b-button @click="practiceClick" class="button" :disabled="practiceButtonDisabled" v-model="easyColor" :style="{backgroundColor: practiceColor }">{{ textPractice }}</b-button>
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
        let practiceColor = ref("gray")
        let easyDisabled = ref(false);
        let difficultDisabled = ref(false);
        let showingFlyingButtons = ref(false);
        let textPractice = ref("Practice");
        let connectDisabled = ref(false);
        let armDisabled = ref(true);
        let takeoffDisabled = ref(true);
        let connectColor = ref("gray");
        let armColor = ref("gray");
        let takeoffColor = ref("gray");
        let connectText = ref("Connect");
        let armText = ref("Arm");  
        let takeoffText = ref("Take Off");      
        
        let state = "idle";
        
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
            selectScenarioDisabled.value = true;
            easyDisabled.value = true;
            difficultDisabled.value = true;
        }

        function practiceClick(){
            if(state == "idle"){
                practiceColor.value = "#973a93"
                context.emit('practice');  
                textPractice.value = "I'm ready. I want to fly!"
                state = "practising";  
            }
            else if(state == "practising"){
                state == "disconnected";
                showingFlyingButtons.value = true;
                practiceColor.value = "gray"
                emitter.emit('videoCapture', {'capturing':false});            
            }
        }

        function connectClick(){
            connectColor.value = "#DC5F00";
            connectText.value = "Connecting...";
            armDisabled.value = false;
            context.emit('connect');
        }

        function armClick(){
            armColor.value = "#DC5F00";
            armText.value = "arming...";
            takeoffDisabled.value = false;
            connectDisabled.value = true;
        }

        function takeoffClick(){
            takeoffColor.value = "#DC5F00";
            takeoffText.value = "taking off...";
            armDisabled.value = true;
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
            practiceClick,
            practiceColor,
            easyDisabled,
            difficultDisabled,
            textPractice,
            showingFlyingButtons,
            connectDisabled,
            connectClick,
            connectColor,
            armClick,
            armColor,
            armDisabled,
            takeoffClick,
            takeoffColor,
            takeoffDisabled,
            connectText,
            armText,
            takeoffText
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
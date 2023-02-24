<template>
    <div style="padding: 10px; display: flex; justify-content: center;">
        <div id="map"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import leaflet from 'leaflet'

export default defineComponent({
    setup () {

        let map;

        onMounted (() => {
            
            map = leaflet.map('map').setView([41.276486, 1.9886], 19); //coordenadas del campus, es posa en un objecte amb id 'map' que posem a la div, el 19 i el maxZoom es per allunyar i apropar
            //leaflet
            // leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            //     maxZoom: 19,
            //     attribution: '© OpenStreetMap'
            // }).addTo(map); 
            
           // MapBox
           let token = "pk.eyJ1Ijoiam9hbmEtb3AiLCJhIjoiY2xkdTRtOHhmMDJjaDN2bXY0Zjl3b2pqeCJ9.6zfF7e0G7vK8Vyy4YE8mxw";
           leaflet.tileLayer('https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.png?access_token='+token, {
                maxZoom: 18,
                attribution: 'MapBox'
            }).addTo(map);
           // map.on("click",onMapClick); // associem el event click a la funcio onMapClick
           // map.on("mousemove",onMapOver); // passar el ratoli per sobre el mapa
           // map.on("contextmenu",onRightClick); //context menu es el click del boto dret del ratoli
       })

        return {}
    }
})
</script>

<style scoped>

    #map {
        width: 70%;
        height: 280px;
        border-style: solid;
    }
</style>
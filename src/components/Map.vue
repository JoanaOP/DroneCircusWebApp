<template>
    <div style="padding: 10px; display: flex; justify-content: center;">
        <div id="map"></div>
    </div>
</template>

<script>
import { defineComponent, onMounted, inject, ref } from 'vue'
import leaflet from 'leaflet'

export default defineComponent({
    setup () {

        let client = inject('mqttClient');

        let map;
        let direction = ref("");

        const ppm = 1/0.1122;

        let practicePointLat = 41.2765003;
        let practicePointLong = 1.9889760;
        let practicePoint = [practicePointLat, practicePointLong];
        let northPoint = [practicePointLat + 0.00003, practicePointLong + 0];
        let southPoint = [practicePointLat - 0.00003, practicePointLong + 0];
        let eastPoint = [practicePointLat + 0, practicePointLong + 0.00004];
        let westPoint = [practicePointLat + 0, practicePointLong - 0.00004];
        let northIcon = leaflet.divIcon({className: 'mylabel', html: "<div style='width: 50;'><b style='color:yellow; margin-left: 2px;'>N</b></div>"})
        let southIcon = leaflet.divIcon({className: 'mylabel', html: "<div style='width: 50;'><b style='color:yellow; margin-left: 2px;'>S</b></div>"})
        let eastIcon = leaflet.divIcon({className: 'mylabel', html: "<div style='width: 50;'><b style='color:yellow;'>E</b></div>"})
        let westIcon = leaflet.divIcon({className: 'mylabel', html: "<div style='width: 50;'><b style='color:yellow;'>W</b></div>"})

        let droneLabLimits = [
                    [41.2764151, 1.9882914],
                    [41.2762170, 1.9883551],
                    [41.2763733, 1.9890491],
                    [41.2765582, 1.9889881],
                ]
        
        //let northLinePoints = [practicePoint,[practicePoint + Math.trunc(5 * self.ppm * Math.sin(Math.PI)), practicePoint + Math.trunc(5 * self.ppm * Math.cos(Math.PI)) ]]
        function setDirection(code){
            if (code == 1){
                direction = "North";
            }
            else if (code == 2){
                direction = "South";
            }
            else if (code == 3){
                direction = "East";
            }
            else if (code == 4){
                direction = "West";
            }
            else if (code == 5){
                direction = "Drop";
            }
            else if (code == 6){
                direction = "Return";
            }
       }

        onMounted (() => {
            
            map = leaflet.map('map').setView([41.276386, 1.9886], 20); //coordenadas del campus, es posa en un objecte amb id 'map' que posem a la div, el 19 i el maxZoom es per allunyar i apropar
                        
           // MapBox
           let token = "pk.eyJ1Ijoiam9hbmEtb3AiLCJhIjoiY2xkdTRtOHhmMDJjaDN2bXY0Zjl3b2pqeCJ9.6zfF7e0G7vK8Vyy4YE8mxw";
           leaflet.tileLayer('https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.png?access_token='+token, {
                maxZoom: 20,
                attribution: 'MapBox'
            }).addTo(map);
           // map.on("click",onMapClick); // associem el event click a la funcio onMapClick
           // map.on("mousemove",onMapOver); // passar el ratoli per sobre el mapa
           // map.on("contextmenu",onRightClick); //context menu es el click del boto dret del ratoli
           let droneLabPolygon = leaflet.polygon(droneLabLimits, {color: 'white'}).addTo(map)
           let wp = leaflet.circle(practicePoint, 0.8, {stroke: false, fill: true, fillColor: "red", fillOpacity: 1}).addTo(map);
           let northLine = leaflet.polyline([practicePoint, northPoint], {color: 'red'}).addTo(map);
           let southLine = leaflet.polyline([practicePoint, southPoint], {color: 'red'}).addTo(map);
           let eastLine = leaflet.polyline([practicePoint, eastPoint], {color: 'red'}).addTo(map);
           let westLine = leaflet.polyline([practicePoint, westPoint], {color: 'red'}).addTo(map);

           let northLabel = leaflet.marker( northPoint, {
                icon: northIcon
            }).addTo(map);
            let southLabel = leaflet.marker( southPoint, {
                icon: southIcon
            }).addTo(map);
            let eastLabel = leaflet.marker( eastPoint, {
                icon: eastIcon
            }).addTo(map);
            let westLabel = leaflet.marker( westPoint, {
                icon: westIcon
            }).addTo(map);

           client.on('message', (topic,message) => {
                if (topic=="imageService/droneCircusWebApp/code"){
                    setDirection(message);
                }
           })
           
       })
       
        return {
            client,
            setDirection,
            direction,
            practicePoint,
            northPoint
        }
    }
})
</script>

<style scoped>

    #map {
        width: 70%;
        height: 360px;
        border-style: solid;
        z-index: 1;
    }
    .mylabel{
        background-color: black;
        width: 50px;  
    }
</style>

d3.json("Data/RegionMapAll.json").then((geojson,err1)=> {

    d3.dsv(",", "Data/TMAS-Complete-Data.csv", (d) => {
        return {
            state: d.State,
            country: d.Country
        };
    }).then((data, err2) => {
        var isActive = false;
        let stateMap;

        // – GeoJson Loader ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– \\

        function jsonLoader (map, stateName){
            if (isActive && stateMap){
                map.removeLayer(stateMap);
                worldMap.addTo(map);
                isActive = false;
            }
            d3.json("Data/" + stateName + ".geojson").then((geojsonS,err1)=> {
                for (let i = 0; i < geojsonS.features.length; i++) {
                    geojsonS.features[i].properties["count"] = 0; // Initialize count

                    for (let j = 0; j < data.length; j++) {
                        if (geojsonS.features[i].properties["name"] === data[j]["state"]) {
                            geojsonS.features[i].properties["count"]++;
                        }
                    }
                }

                isActive = true;

                var x = parseFloat(geojsonS.properties["x"]);
                var y = parseFloat(geojsonS.properties["y"]);
                var zoom = geojsonS.properties["zoom"];

                map.removeLayer(worldMap);
                map.setView([x, y], zoom);

                if (stateName === "United States of America"){
                    stateMap = L.geoJson(geojsonS, {
                        style: state_styleLarge,
                        onEachFeature: onEachFeature
                    });
                }

                else{
                    stateMap = L.geoJson(geojsonS, {
                        style: state_styleSmall,
                        onEachFeature: onEachFeature
                    });
                }
                stateMap.addTo(map);
            })
        }

        // – Map –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– \\

        var map = L.map('map', {
            center: [52.906402418294526, -47.96448321837776], // Centered over the US
            zoom: 2,
            minZoom: 1,
            maxZoom: 9,
            attributionControl: false,
            zoomControl: true
        });

        var southWest = L.latLng(-60, -195); // Southwest corner of the world
        var northEast = L.latLng(85, 195); // Northeast corner of the world
        map.setMaxBounds(L.latLngBounds(southWest, northEast));

        map.on('drag', function() {
            map.panInsideBounds(map.getBounds());
        });

        // – Info ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– \\

        var info = L.control({ position: 'topleft' });

        info.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info');
            hideInfoBox();
            this.update();
            return this._div;
        };

        info.update = function (props) {
            let message = "<b>No one yet, be the first!</b>";

            if (props && props.count > 0){
                message = '<b>' + props.count + ' swappers!' + '</b>';
            }

            if (props && props.count == 1){
                message = '<b>' + props.count + ' swapper!' + '</b>';
            }

            this._div.innerHTML = (props ?
                '<h4>' + props.name + '</h4>' + message
                : 'Hover over the map');
        };

        info.addTo(map);

        function onMapMouseMove(e) {
            var mapContainer = map.getContainer().getBoundingClientRect();
            var boxWidth = info._div.offsetWidth;
            var boxHeight = info._div.offsetHeight;
            var x = e.originalEvent.clientX - mapContainer.left;
            var y = e.originalEvent.clientY - mapContainer.top;

            // Check boundaries to keep the box inside the map
            x = Math.min(x, mapContainer.width - boxWidth - 35); // 10px padding from right edge
            y = Math.min(y, mapContainer.height - boxHeight - 110); // 10px padding from bottom edge
            x = Math.max(x, 35); // 10px padding from left edge
            y = Math.max(y, 10); // 10px padding from top edge

            info._div.style.left = x + 'px';
            info._div.style.top = y + 'px';
        }

        function showInfoBox() {
            info._div.style.display = 'block';
        }

        function hideInfoBox() {
            info._div.style.display = 'none';
        }

        // – Title –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– \\

        var legend = L.control({position: 'topright'});

        legend.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'legend');
            this._div.innerHTML = "<h4>TMAS Swappers Worldwide</h4>" + '<b>' + "Mouseover for participant numbers " +
                "<br> Click for country specifics <br> Click & drag to move" + '</b></br>';
            return this._div;
        };

        legend.update = function(name){
            if (name === "TMAS Swappers Worldwide"){
                this._div.innerHTML = "<h4>" + name +"</h4>" + '<b>' + '<b>' + "Mouseover for participant numbers " +
                    "<br> Click for country specifics <br> Click & drag to move" + '</b></br>';
            }
            else{
                this._div.innerHTML = "<h4>" + name +"</h4>" + '<b>' + "Mouseover for participant numbers <br> " +
                    "Click map for world view" + '</b></br>';
            }

        }

        legend.addTo(map);

        // – Color ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– \\

        function getColorLarge(d) {
            return d > 40 ? '#815b13' :
                d > 30 ? '#a87a25' :
                    d > 20 ? '#cf9c3f' :
                        d > 10 ? '#ddb262' :
                            d > 5 ? '#e6ca93' :
                                d >= 1 ? '#f8e6c4' :
                                    d > 0 ? 'rgb(195,195,195)' :
                                        'rgba(195,195,195,0.25)';
        }

        function getColorSmall(d) {
            return d > 6 ? '#815b13' :
                d > 5 ? '#a87a25' :
                    d > 4 ? '#cf9c3f' :
                        d > 3 ? '#ddb262' :
                            d > 2 ? '#e6ca93' :
                                d >= 1 ? '#f8e6c4' :
                                    d > 0 ? 'rgb(195,195,195)' :
                                        'rgba(195,195,195,0.25)';
        }

        function getColorC(d) {
            return d > 40 ? '#4e0d20' :
                d > 30 ? '#7c1f3a' :
                    d > 6 ? '#b24363' :
                        d > 4 ? '#d36383' :
                            d > 2 ? '#f498b3' :
                                d >= 1 ? '#f4c4d2' :
                                    d > 0 ? 'rgb(195,195,195)' :
                                        'rgba(195,195,195,0.25)';
        }

        function state_styleSmall(feature) {
            return {
                fillColor: getColorSmall(feature.properties["count"]),
                weight: 2,
                opacity: 1,
                color: '#ffffff',
                fillOpacity: 1
            };
        }

        function state_styleLarge(feature) {
            return {
                fillColor: getColorLarge(feature.properties["count"]),
                weight: 2,
                opacity: 1,
                color: '#ffffff',
                fillOpacity: 1
            };
        }

        function country_style(feature) {
            return {
                fillColor: getColorC(feature.properties["count"]),
                weight: 2,
                opacity: 1,
                color: '#ffffff',
                fillOpacity: 1
            };
        }

        // – Functions –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– \\

        function highlightFeature(e) {
            var layer = e.target;

            layer.setStyle({
                weight: 5,
                color: '#ffffff',
                dashArray: '',
                fillOpacity: 1
            });

            layer.bringToFront();
            info.update(layer.feature.properties);
            showInfoBox();
            map.on('mousemove', onMapMouseMove);
        }

        function resetHighlight(e) {
            var layer = e.target;

            layer.setStyle({
                weight: 2,
                color: '#ffffff',
                dashArray: '',
                fillOpacity: 1
            });
            info.update();
            hideInfoBox();
            map.off('mousemove', onMapMouseMove);
        }

        function toggleMap(e) {
            let mapName = "TMAS Swappers Worldwide";
            var clickedFeature = e.target.feature;

            legend.update(mapName);
            if (!clickedFeature){
                mapName = "TMAS Swappers Worldwide";
                return mapName;
            }
            else if (map.hasLayer(worldMap)) {
                d3.json("Data/" + clickedFeature.properties.name + ".geojson").then((geojsonS) => {
                    if (geojsonS) {
                        // If geojson data exists, proceed with loading the new map layer
                        jsonLoader(map, clickedFeature.properties.name);
                        mapName = "Swappers in: " + clickedFeature.properties.name;
                        legend.update(mapName);
                    } else {
                        // If no geojson data is found, reset title to default
                        mapName = "TMAS Swappers Worldwide";
                        legend.update(mapName);
                    }
                }).catch((err) => {
                    // In case of an error (like missing file), reset title to default
                    mapName = "TMAS Swappers Worldwide";
                    legend.update(mapName);
                });
            }
            else {
                map.addLayer(worldMap);
                map.removeLayer(stateMap);
                map.flyTo([52.906402418294526, -47.96448321837776], 2, { duration: .4 });
                mapName = "TMAS Swappers Worldwide";
            }
            legend.update(mapName);
        }

        function onEachFeature(feature, layer) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: toggleMap
            });
        }

        // – World –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– \\

        for (let i = 0; i < geojson.features.length; i++) {
            geojson.features[i].properties["count"] = 0; // Initialize count

            for (let j = 0; j < data.length; j++) {
                if (geojson.features[i].properties["name"] === data[j]["country"]) {
                    geojson.features[i].properties["count"]++;
                }
            }
        }

        let worldMap = L.geoJson(geojson, {
            style: country_style,
            onEachFeature: onEachFeature
        }).addTo(map);
    })
});
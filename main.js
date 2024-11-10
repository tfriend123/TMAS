d3.json("Data/us-states.json").then((geojsonS,err1)=> {

    d3.json("Data/RegionMapAll.json").then((geojson,err1)=> {

        d3.json("Data/germany.geojson").then((geojsonG,err1)=> {

            d3.json("Data/uk.geojson").then((geojsonUK,err1)=> {

                d3.json("Data/canada.geojson").then((geojsonC,err1)=> {

                    d3.json("Data/spain.geojson").then((geojsonSp,err1)=> {

                        d3.json("Data/ireland.geojson").then((geojsonI,err1)=> {

                            d3.json("Data/australia.geojson").then((geojsonA,err1)=> {

                                d3.json("Data/nz.json").then((geojsonZ,err1)=> {

                                    d3.json("Data/netherlands.geojson").then((geojsonN,err1)=> {

                                        d3.json("Data/no.json").then((geojsonNO,err1)=> {

                                            d3.json("Data/swiss.json").then((geojsonSW,err1)=> {

                                                d3.json("Data/tt.json").then((geojsonT,err1)=> {

                                                    d3.dsv(",", "Data/TMAS-Complete-Data.csv", (d) => {
                                                        return {
                                                            state: d.State,
                                                            country: d.Country
                                                        };
                                                    }).then((data, err2) => {

                                                        // – Map ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– \\

                                                        var map = L.map('map', {
                                                            center: [52.906402418294526, -47.96448321837776], // Centered over the US
                                                            zoom: 3,
                                                            minZoom: 2,
                                                            maxZoom: 9,
                                                            attributionControl: false,
                                                            zoomControl: true
                                                        });

                                                        var southWest = L.latLng(-60, -180); // Southwest corner of the world
                                                        var northEast = L.latLng(85, 187); // Northeast corner of the world
                                                        map.setMaxBounds(L.latLngBounds(southWest, northEast));

                                                        map.on('drag', function() {
                                                            map.panInsideBounds(map.getBounds());
                                                        });

                                                        // – Info –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– \\

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

                                                        // – Title ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– \\

                                                        var legend = L.control({position: 'topright'});

                                                        legend.onAdd = function (map) {
                                                            this._div = L.DomUtil.create('div', 'legend');
                                                            this._div.innerHTML = "<h4>Global Swapper Density</h4>" + '<b>' + "Hover over the map & click" + '</b></br>';
                                                            return this._div;
                                                        };

                                                        legend.update = function(name){
                                                            this._div.innerHTML = "<h4>" + name +"</h4>" + '<b>' + "Hover over the map & click" + '</b></br>';
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

                                                        // – Functions ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– \\

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
                                                            let mapName = "";
                                                            var clickedFeature = e.target.feature;
                                                            if (!clickedFeature) return;

                                                            if (map.hasLayer(worldMap)) {

                                                                if (clickedFeature.properties["name"] === "United States of America") {
                                                                    map.removeLayer(worldMap);
                                                                    map.addLayer(stateMap);
                                                                    map.setView([38.5, -96], 5);
                                                                    mapName = "United States Swapper Density";
                                                                }

                                                                else if (clickedFeature.properties["name"] === "Germany") {
                                                                    map.removeLayer(worldMap);
                                                                    map.addLayer(stateMapG);
                                                                    map.setView([50.87516727695286, 10.321618203560337], 6);
                                                                    mapName = "Germany Swapper Density";
                                                                }

                                                                else if (clickedFeature.properties["name"] === "United Kingdom") {
                                                                    map.removeLayer(worldMap);
                                                                    map.addLayer(stateMapUK);
                                                                    map.setView([54.7, -3.9497794060550078], 6);
                                                                    mapName = "United Kingdom Swapper Density";
                                                                }

                                                                else if (clickedFeature.properties["name"] === "Canada") {
                                                                    map.removeLayer(worldMap);
                                                                    map.addLayer(stateMapC);
                                                                    map.setView([60.197933154914715, -95.21289755195478], 4);
                                                                    mapName = "Canada Swapper Density";
                                                                }
                                                                else if (clickedFeature.properties["name"] === "Spain") {
                                                                    map.removeLayer(worldMap);
                                                                    map.addLayer(stateMapSp);
                                                                    map.setView([39.837815467519896, -1.8992355616652372], 6);
                                                                    mapName = "Spain Swapper Density";
                                                                }
                                                                else if (clickedFeature.properties["name"] === "Ireland") {
                                                                    map.removeLayer(worldMap);
                                                                    map.addLayer(stateMapI);
                                                                    map.setView([53.4, -8.062445351062129], 7);
                                                                    mapName = "Ireland Swapper Density";
                                                                }
                                                                else if (clickedFeature.properties["name"] === "Australia") {
                                                                    map.removeLayer(worldMap);
                                                                    map.addLayer(stateMapA);
                                                                    map.setView([-26.49540274412037, 135.4213558576099], 4);
                                                                    mapName = "Australia Swapper Density";
                                                                }
                                                                else if (clickedFeature.properties["name"] === "New Zealand") {
                                                                    map.removeLayer(worldMap);
                                                                    map.addLayer(stateMapZ);
                                                                    map.setView([-41.429304098452704, 173.43089576636285], 6);
                                                                    mapName = "New Zealand Swapper Density";
                                                                }
                                                                else if (clickedFeature.properties["name"] === "Netherlands") {
                                                                    map.removeLayer(worldMap);
                                                                    map.addLayer(stateMapN);
                                                                    map.setView([52.17436142105231, 5.5], 7);
                                                                    mapName = "Netherlands Swapper Density";
                                                                }
                                                                else if (clickedFeature.properties["name"] === "Norway") {
                                                                    map.removeLayer(worldMap);
                                                                    map.addLayer(stateMapNO);
                                                                    map.setView([65.33424208771788, 13.018297738986297], 5);
                                                                    mapName = "Norway Swapper Density";
                                                                }
                                                                else if (clickedFeature.properties["name"] === "Switzerland") {
                                                                    map.removeLayer(worldMap);
                                                                    map.addLayer(stateMapSW);
                                                                    map.setView([46.7, 8.084404661788334], 8);
                                                                    mapName = "Switzerland Swapper Density";
                                                                }
                                                                else if (clickedFeature.properties["name"] === "Trinidad and Tobago") {
                                                                    map.removeLayer(worldMapT);
                                                                    map.addLayer(stateMap);
                                                                    map.setView([10.627166668126312, -61.15205817572308], 9);
                                                                    mapName = "Trinidad & Tobago Swapper Density";
                                                                }
                                                                else{
                                                                    mapName = "Global Swapper Density";
                                                                }

                                                            } else {
                                                                map.addLayer(worldMap);
                                                                map.removeLayer(stateMap);
                                                                map.removeLayer(stateMapG);
                                                                map.removeLayer(stateMapUK);
                                                                map.removeLayer(stateMapC);
                                                                map.removeLayer(stateMapSp);
                                                                map.removeLayer(stateMapI);
                                                                map.removeLayer(stateMapA);
                                                                map.removeLayer(stateMapZ);
                                                                map.removeLayer(stateMapN);
                                                                map.removeLayer(stateMapNO);
                                                                map.removeLayer(stateMapSW);
                                                                map.removeLayer(stateMapT);
                                                                map.setView([52.906402418294526, -47.96448321837776], 3);
                                                                mapName = "Global Swapper Density";
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

                                                        // – World ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– \\

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

                                                        // – USA ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– \\

                                                        for (let i = 0; i < geojsonS.features.length; i++) {
                                                            geojsonS.features[i].properties["count"] = 0; // Initialize count

                                                            for (let j = 0; j < data.length; j++) {
                                                                if (geojsonS.features[i].properties["name"] === data[j]["state"]) {
                                                                    geojsonS.features[i].properties["count"]++;
                                                                }
                                                            }
                                                        }

                                                        let stateMap = L.geoJson(geojsonS, {
                                                            style: state_styleLarge,
                                                            onEachFeature: onEachFeature
                                                        });

                                                        // – Germany ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– \\

                                                        for (let i = 0; i < geojsonG.features.length; i++) {
                                                            geojsonG.features[i].properties["count"] = 0; // Initialize count

                                                            for (let j = 0; j < data.length; j++) {
                                                                if (geojsonG.features[i].properties["name"] === data[j]["state"]) {
                                                                    geojsonG.features[i].properties["count"]++;
                                                                }
                                                            }
                                                        }

                                                        let stateMapG = L.geoJson(geojsonG, {
                                                            style: state_styleSmall,
                                                            onEachFeature: onEachFeature
                                                        });

                                                        // – UK –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– \\

                                                        for (let i = 0; i < geojsonUK.features.length; i++) {
                                                            geojsonUK.features[i].properties["count"] = 0; // Initialize count

                                                            for (let j = 0; j < data.length; j++) {
                                                                if (geojsonUK.features[i].properties["name"] === data[j]["state"]) {
                                                                    geojsonUK.features[i].properties["count"]++;
                                                                }
                                                            }
                                                        }

                                                        let stateMapUK = L.geoJson(geojsonUK, {
                                                            style: state_styleSmall,
                                                            onEachFeature: onEachFeature
                                                        });

                                                        // – Canada –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– \\

                                                        for (let i = 0; i < geojsonC.features.length; i++) {
                                                            geojsonC.features[i].properties["count"] = 0; // Initialize count

                                                            for (let j = 0; j < data.length; j++) {
                                                                if (geojsonC.features[i].properties["name"] === data[j]["state"]) {
                                                                    geojsonC.features[i].properties["count"]++;
                                                                }
                                                            }
                                                        }

                                                        let stateMapC = L.geoJson(geojsonC, {
                                                            style: state_styleLarge,
                                                            onEachFeature: onEachFeature
                                                        });

                                                        // – Spain –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– \\

                                                        for (let i = 0; i < geojsonSp.features.length; i++) {
                                                            geojsonSp.features[i].properties["count"] = 0; // Initialize count

                                                            for (let j = 0; j < data.length; j++) {
                                                                if (geojsonSp.features[i].properties["name"] === data[j]["state"]) {
                                                                    geojsonSp.features[i].properties["count"]++;
                                                                }
                                                            }
                                                        }

                                                        let stateMapSp = L.geoJson(geojsonSp, {
                                                            style: state_styleSmall,
                                                            onEachFeature: onEachFeature
                                                        });

                                                        // – Ireland –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– \\

                                                        for (let i = 0; i < geojsonI.features.length; i++) {
                                                            geojsonI.features[i].properties["count"] = 0; // Initialize count

                                                            for (let j = 0; j < data.length; j++) {
                                                                if (geojsonI.features[i].properties["name"] === data[j]["state"]) {
                                                                    geojsonI.features[i].properties["count"]++;
                                                                }
                                                            }
                                                        }

                                                        let stateMapI = L.geoJson(geojsonI, {
                                                            style: state_styleSmall,
                                                            onEachFeature: onEachFeature
                                                        });

                                                        // – Australia –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– \\

                                                        for (let i = 0; i < geojsonA.features.length; i++) {
                                                            geojsonA.features[i].properties["count"] = 0; // Initialize count

                                                            for (let j = 0; j < data.length; j++) {
                                                                if (geojsonA.features[i].properties["name"] === data[j]["state"]) {
                                                                    geojsonA.features[i].properties["count"]++;
                                                                }
                                                            }
                                                        }

                                                        let stateMapA = L.geoJson(geojsonA, {
                                                            style: state_styleSmall,
                                                            onEachFeature: onEachFeature
                                                        });

                                                        // – New Zealand –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– \\

                                                        for (let i = 0; i < geojsonZ.features.length; i++) {
                                                            geojsonZ.features[i].properties["count"] = 0; // Initialize count

                                                            for (let j = 0; j < data.length; j++) {
                                                                if (geojsonZ.features[i].properties["name"] === data[j]["state"]) {
                                                                    geojsonZ.features[i].properties["count"]++;
                                                                }
                                                            }
                                                        }

                                                        let stateMapZ = L.geoJson(geojsonZ, {
                                                            style: state_styleSmall,
                                                            onEachFeature: onEachFeature
                                                        });

                                                        // – Netherlands –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– \\

                                                        for (let i = 0; i < geojsonN.features.length; i++) {
                                                            geojsonN.features[i].properties["count"] = 0; // Initialize count

                                                            for (let j = 0; j < data.length; j++) {
                                                                if (geojsonN.features[i].properties["name"] === data[j]["state"]) {
                                                                    geojsonN.features[i].properties["count"]++;
                                                                }
                                                            }
                                                        }

                                                        let stateMapN = L.geoJson(geojsonN, {
                                                            style: state_styleSmall,
                                                            onEachFeature: onEachFeature
                                                        });

                                                        // – Norway –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– \\

                                                        for (let i = 0; i < geojsonNO.features.length; i++) {
                                                            geojsonNO.features[i].properties["count"] = 0; // Initialize count

                                                            for (let j = 0; j < data.length; j++) {
                                                                if (geojsonNO.features[i].properties["name"] === data[j]["state"]) {
                                                                    geojsonNO.features[i].properties["count"]++;
                                                                }
                                                            }
                                                        }

                                                        let stateMapNO = L.geoJson(geojsonNO, {
                                                            style: state_styleSmall,
                                                            onEachFeature: onEachFeature
                                                        });

                                                        // – Switzerland –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– \\

                                                        for (let i = 0; i < geojsonSW.features.length; i++) {
                                                            geojsonSW.features[i].properties["count"] = 0; // Initialize count

                                                            for (let j = 0; j < data.length; j++) {
                                                                if (geojsonSW.features[i].properties["name"] === data[j]["state"]) {
                                                                    geojsonSW.features[i].properties["count"]++;
                                                                }
                                                            }
                                                        }

                                                        let stateMapSW = L.geoJson(geojsonSW, {
                                                            style: state_styleSmall,
                                                            onEachFeature: onEachFeature
                                                        });

                                                        // – Trinidad and Tobago –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– \\

                                                        for (let i = 0; i < geojsonT.features.length; i++) {
                                                            geojsonT.features[i].properties["count"] = 0; // Initialize count

                                                            for (let j = 0; j < data.length; j++) {
                                                                if (geojsonT.features[i].properties["name"] === data[j]["state"]) {
                                                                    geojsonT.features[i].properties["count"]++;
                                                                }
                                                            }
                                                        }

                                                        let stateMapT = L.geoJson(geojsonT, {
                                                            style: state_styleSmall,
                                                            onEachFeature: onEachFeature
                                                        });
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })
});
function iOS() {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
  // iPad on iOS 13 detection
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
}

const coalesce = (...args) => args.find(_ => ![undefined, null].includes(_));

var button = document.createElement('button');
button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M17.27 6.73l-4.24 10.13-1.32-3.42-.32-.83-.82-.32-3.43-1.33 10.13-4.23M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z"/></svg>'

var goToCurrentLocation = function(e) {
  geolocation.setTracking(true);
  if (lastCoordinate) {
    let view = map.getView();
    view.setCenter(lastCoordinate);
    view.setZoom(18);
  }
  else {
    needsSetCenter = true;
  }
};

button.addEventListener('click', goToCurrentLocation, false);

var element = document.createElement('div');
element.className = 'current_loc ol-control';
element.appendChild(button);
var GotoCurrentLocControl = new ol.control.Control({
  element: element
});

var button_google = document.createElement('button');
button_google.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 150 150">
	<path fill="#1a73e8" d="M89.77,10.4c-4.4-1.39-9.08-2.15-13.94-2.15c-14.18,0-26.87,6.41-35.33,16.48l21.8,18.34L89.77,10.4z"/>
	<path fill="#ea4335" d="M40.49,24.73c-6.74,8.02-10.81,18.37-10.81,29.66c0,8.68,1.73,15.71,4.57,22.01l28.04-33.33L40.49,24.73z"/>
	<path fill="#4285f4" d="M75.83,36.75c9.75,0,17.65,7.9,17.65,17.65c0,4.34-1.57,8.32-4.17,11.39c0,0,13.94-16.58,27.47-32.66   c-5.59-10.75-15.28-19.02-27-22.73L62.29,43.07C65.53,39.2,70.39,36.75,75.83,36.75"/>
	<path fill="#fbbc04" d="M75.83,72.04c-9.75,0-17.65-7.9-17.65-17.65c0-4.31,1.55-8.26,4.11-11.33L34.25,76.4   c4.79,10.63,12.76,19.16,20.97,29.91L89.3,65.79C86.07,69.61,81.23,72.04,75.83,72.04"/>
	<path fill="#34a853" d="M88.63,117.37c15.39-24.07,33.34-35,33.34-62.98c0-7.67-1.88-14.9-5.19-21.26l-61.55,73.18   c2.61,3.42,5.24,7.06,7.81,11.07c9.36,14.46,6.76,23.13,12.8,23.13C81.86,140.51,79.27,131.83,88.63,117.37"/>
</svg>`;

var goToGMaps = function(e) {

  let z = map.getView().getZoom();
  let center = ol.proj.toLonLat(map.getView().getCenter());
  let url = `https://www.google.com/maps/@${center[1]},${center[0]},${z}z`;

  window.open(url);
};

button_google.addEventListener('click', goToGMaps, false);

var button_osm = document.createElement('button');
button_osm.innerHTML = `<img class="osm" src=https://upload.wikimedia.org/wikipedia/commons/b/b0/Openstreetmap_logo.svg />`;

var goToOSM = function(e) {
  let z = map.getView().getZoom();
  let center = ol.proj.toLonLat(map.getView().getCenter());
  let url = `https://www.openstreetmap.org/#map=${z}/${center[1]}/${center[0]}/`;
  window.open(url);
};

button_osm.addEventListener('click', goToOSM, false);

var button_sat = document.createElement('button');
button_sat.classList.add('sat_button');
button_sat.innerHTML = `<img src="sat.png" />`;

var goToSat = function(e) {
  toggleBaseLayer();
};

button_sat.addEventListener('click', goToSat, false);

var element_map = document.createElement('div');
element_map.className = 'goto_maps ol-control';
element_map.appendChild(button_sat);
element_map.appendChild(button_google);
element_map.appendChild(button_osm);

var GoToGMapsControl = new ol.control.Control({
  element: element_map
});

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

var server = 'a';
if (getCookie("server")) {
  server = getCookie("server");
}

var lonlat = [0, 0];
var zoom = 5;
var qstr = "";
var selectedPoiId;
if (window.location.href.indexOf("#") > -1) {
  qstr = window.location.href.split("#")[1];
}
else {
  qstr = getCookie("qstr");
}

if (qstr.indexOf("!") > -1) {
  let arr = qstr.split("!");
  qstr = arr[0];
  selectedPoiId = arr[1];
}

if (qstr !== "") {
  let maploc = qstr.split("/");
  lonlat = [maploc[2], maploc[1]];
  zoom = maploc[0]
}

var interactions = ol.interaction.defaults({altShiftDragRotate:false, pinchRotate:false, doubleClickZoom: true, keyboard: true, shiftDragZoom: true, dragPan: true});

var subserver = server + '.';
subserver = '';

function getBaseLayer(urls) {
  let base_source = new ol.source.XYZ({
    attributions: [ol.source.OSM.ATTRIBUTION],
    opaque: true,
    imageSmoothing: false,
    cacheSize: 200,
    transition: 100,
    urls: urls,
    crossOrigin: null,
    tilePixelRatio: 2
  });

  base_source.on('tileloaderror', function(event) {
    setTimeout(function(){
      event.tile.load()
    }, 5000 * Math.random());
  });

  let base_layer = new ol.layer.Tile({
    preload: 7,
    source: base_source,
  })
  return base_layer;
}

var map = new ol.Map({
  target: 'map',
  interactions: interactions,
  maxTilesLoading: 50,
  controls: [new ol.control.Attribution({collapsible: true}), new ol.control.Zoom({className: "zoomControl"})],
  view: new ol.View({
    center: ol.proj.fromLonLat(lonlat),
    zoom: zoom,
    maxZoom: 19,
    constrainResolution : true,
  })
});

map.addControl(GotoCurrentLocControl);
map.addControl(GoToGMapsControl);

var geolocation = new ol.Geolocation({
  trackingOptions: {
    enableHighAccuracy: true,
  },
  projection: map.getView().getProjection(),
});

var baseLayer;
function setBaseLayer(urls) {
  if (baseLayer) {
    map.removeLayer(baseLayer);
  }
  baseLayer = getBaseLayer(urls);
  map.addLayer(baseLayer);
}

var isSatelliteBase = false;

function toggleBaseLayer() {
  if (isSatelliteBase) {
    setBaseLayer(["https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.jpg90?access_token=pk.eyJ1Ijoic3Ryb25nd2lsbG93IiwiYSI6ImxKa2R1SEkifQ.iZ_vj1lvuvrAcUIl0ZE5XA"]);
    button_sat.innerHTML = `<img src="street.png" />`;
  }
  else {
    setBaseLayer(['https://a.tiles.tracestrack.com/base/{z}/{x}/{y}.png?key=d750a1a29e913dea376aca86cc95de5a','https://c.tiles.tracestrack.com/base/{z}/{x}/{y}.png?key=d750a1a29e913dea376aca86cc95de5a']);
    button_sat.innerHTML = `<img src="sat.png" />`;
  }
  if (labelName) {
    setLanguageLayer(labelName);
  }

  if (routeLayer) {
    map.removeLayer(routeLayer);
    map.addLayer(routeLayer);
  }
  isSatelliteBase = !isSatelliteBase;
}

var languageLayer;
var labelName;

function setLanguageLayer(label_name) {
  labelName = label_name;
  if (languageLayer) {
    map.removeLayer(languageLayer);
  }

  languageLayer = new ol.layer.Tile({
    preload: 5,
    source: new ol.source.XYZ({
      opaque: false,
      imageSmoothing: false,
      cacheSize: 200,
      transition: 200,
      urls: ['https://b.tiles.tracestrack.com/' + label_name + '/{z}/{x}/{y}.png?key=d750a1a29e913dea376aca86cc95de5a',
             'https://c.tiles.tracestrack.com/' + label_name + '/{z}/{x}/{y}.png?key=d750a1a29e913dea376aca86cc95de5a'],
      crossOrigin: null,
      tilePixelRatio: 2
    }),
  });
  map.addLayer(languageLayer);

  setCookie("lang", label_name, 1000);
}

if (getCookie("lang") === "") {
  setCookie("lang", "en-name", 1000);
}

setLanguageLayer(getCookie("lang"));

toggleBaseLayer();

function setRetinaEnabled(ena) {
  setCookie("retina", ena, 1000);
  location.reload();
}

function setServer(s) {
  setCookie("server", s, 1000);
  location.reload();
}

function setURL(lonlat, zoom) {
  let qstr = zoom.toFixed(0) + "/" + lonlat[1].toFixed(4) + "/" + lonlat[0].toFixed(4)

  var appending = "";
  if (selectedPoiId) {
    appending = "!" + selectedPoiId;
  }

  window.location.href = "#" + qstr + appending;

  setCookie("qstr", qstr, 1000);
}

map.on('moveend', onMoveEnd);

function onMoveEnd(evt) {
  var map = evt.map;
  let z = map.getView().getZoom();
  let center = ol.proj.toLonLat(map.getView().getCenter());

  setURL(center, z);

  if (poiLayer) {
    if (z >= 19) {
      poiLayer.setVisible(true);
    }
    else {
      poiLayer.setVisible(false);
    }
  }
}


var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var popupOverlay = new ol.Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250,
  }
});

map.addOverlay(popupOverlay);

var prevFeature;
map.on("pointermove", function (evt) {
  var hit = this.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
    if (feature.getProperties().name == "place") {

      prevFeature = feature;

      let id = feature.getProperties().id;
      let r = places_map.filter(x => x[3] == id);

      if (id != poi_selected_id) {
        feature.setStyle(POI_HOVER_STYLE);
      }

      var coordinate = feature.getProperties().geometry.getCoordinates();

      content.innerHTML = coalesce(r[0][2].name, "No name");
      popupOverlay.setPosition(coordinate);
    }
    return true;
  });
  if (hit) {
    this.getTargetElement().style.cursor = 'pointer';
  } else {
    if (prevFeature && prevFeature.getProperties().id != poi_selected_id) {
      popupOverlay.setPosition(undefined);
      this.getTargetElement().style.cursor = '';
      if (prevFeature) {
        prevFeature.setStyle(POI_NORMAL_STYLE);
        prevFeature = null;
      }
    }
  }
});

var accuracyFeature = new ol.Feature();
geolocation.on('change:accuracyGeometry', function () {
  accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
});

var positionFeature = new ol.Feature();
positionFeature.setStyle(
  new ol.style.Style({
    image: new ol.style.Circle({
      radius: 6,
      fill: new ol.style.Fill({
        color: '#3399CC',
      }),
      stroke: new ol.style.Stroke({
        color: '#fff',
        width: 2,
      }),
    }),
  })
);

var lastCoordinate;
var needsSetCenter = false;
geolocation.on('change:position', function () {
  let coordinates = geolocation.getPosition();
  positionFeature.setGeometry(coordinates ? new ol.geom.Point(coordinates) : null);

  if (needsSetCenter) {
    let view = map.getView();
    view.setCenter(coordinates);
    view.setZoom(18);
    needsSetCenter = false;
  }

  lastCoordinate = coordinates;

  if (acceptingCurrentLocation == "to") {
    useCurrentLocationAsTo();
  }
  else if (acceptingCurrentLocation == "from") {
    useCurrentLocationAsFrom();
  }

});


function transform(extent) {
  return ol.proj.transformExtent(extent, 'EPSG:4326', 'EPSG:3857');
}

function createSearchFeature(geo) {
  var searchFeature = new ol.Feature({name: "search"});
  searchFeature.setStyle(
    new ol.style.Style({
      image: new ol.style.Circle({
        radius: 20,
        fill: new ol.style.Fill({
          color: '#FFFF0099',
        }),
        stroke: new ol.style.Stroke({
          color: '#ff6600cc',
          width: 2,
        }),
      }),
    })
  );
  searchFeature.setGeometry(geo);
  return searchFeature;
};

let POI_SELECTED_STYLE = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 15,
    fill: new ol.style.Fill({
      color: '#FFFFee11',
    }),
    stroke: new ol.style.Stroke({
      color: '#ff00ff55',
      width: 4,
    }),
  }),
});

let POI_HOVER_STYLE = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 11,
    fill: new ol.style.Fill({
      color: '#FFFFee11',
    }),
    stroke: new ol.style.Stroke({
      color: '#ff00ff55',
      width: 3,
    }),
  }),
});

let POI_NORMAL_STYLE = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 11,
    fill: new ol.style.Fill({
      color: '#FFFF0011',
    }),
    stroke: new ol.style.Stroke({color: '#ff00ff55', width: 1}),
  }),
});

let PLACE_NORMAL_STYLE = new ol.style.Style({
  image: new ol.style.RegularShape({
    fill: new ol.style.Fill({color: '#FFFFFF11'}),
    stroke: new ol.style.Stroke({color: '#ff00ff55', width: 2}),
    points: 6,
    radius: 10,
    radius2: 10,
    angle: 00,
  })
});

function createPlacesFeature(geo, tags, id) {

  var feature = new ol.Feature({name: "place", id: id});
  if (tags["place"]) {
    feature.setStyle(POI_NORMAL_STYLE);//    feature.setStyle(PLACE_NORMAL_STYLE);
  }
  else {
    feature.setStyle(POI_NORMAL_STYLE);
  }
  feature.setGeometry(geo);
  return feature;
};

var searchLayer;

function updateSearchFeatureLayer(features) {
  if (searchLayer) {
    map.removeLayer(searchLayer);
  }

  searchLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: features,
    }),
  });

  map.addLayer(searchLayer);
}

function showSearchResult(res) {

  let e = res;
  let extent = transform([e.boundingbox[2], e.boundingbox[0],
                          e.boundingbox[3], e.boundingbox[1]]);

  let view = map.getView();
  view.fit(extent);

  let p = ol.proj.fromLonLat([e.lon, e.lat]);
  var features = createSearchFeature(new ol.geom.Point(p));
  updateSearchFeatureLayer([features]);
}

var placesLayer;
function updatePlacesLayer(features) {
  if (placesLayer) {
    map.removeLayer(placesLayer);
  }

  console.log(features);

  placesLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: features,
    })
  });

  map.addLayer(placesLayer);
}

var poiLayer;
function updatePoiLayer(features) {
  if (poiLayer) {
    map.removeLayer(poiLayer);
  }

  console.log(features);

  poiLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: features,
    })
  });

  map.addLayer(poiLayer);
}

function postOverpass(data, cb) {
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        let json = JSON.parse(this.responseText);
        cb(json);
      }
      else {
        lastPoiQueryCenter = null;
      }
    }
  };

  let url = "https://lz4.overpass-api.de/api/interpreter";

  xhttp.open("POST", url, true);

  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
  let wrapped_data = 'data=' + encodeURIComponent(data);
  xhttp.send(wrapped_data);
}

function mouseoverlist(i) {
  console.log(places_map[i])
}


var poi_selected_id = -1;

function mouseclicklist(i) {

  showPoi(places_map[i]);

  if(prevFeature && poi_selected_id != place_features[i].getProperties().id) prevFeature.setStyle(POI_NORMAL_STYLE);

  prevFeature = place_features[i]
  prevFeature.setStyle(POI_SELECTED_STYLE)
  poi_selected_id = prevFeature.getProperties().id;
}

function closelist() {
  document.getElementById("popup-list").style.display = "none";
}

var places_map = [];
var place_features = [];
function showPlaces(res) {
  console.log(res);

  places_map = res.elements.map(x => [x["center"] ? x["center"]["lon"] : x.lon, x["center"] ? x["center"]["lat"] : x.lat, x.tags, x.id, x.type]);

  place_features = places_map.map(x => createPlacesFeature(new ol.geom.Point(ol.proj.fromLonLat([x[0], x[1]])), x[2], x[3]));

  var list = `<h5>List</h5><div class="close"><button type="button" class="btn-close" aria-label="Close" onclick="closelist()" /></div>`;
  for(var i in places_map) {
    list += `<li onmouseenter='mouseoverlist(${i})'><a href='javascript:mouseclicklist(${i})'>` + places_map[i][2]["name"] + "</a></li>";
  }

  document.getElementById("popup-list").innerHTML = list;
  document.getElementById("popup-list").style.display = "block";

  updatePlacesLayer(place_features);
}

new ol.layer.Vector({
  map: map,
  source: new ol.source.Vector({
    features: [accuracyFeature, positionFeature],
  }),
});

function removeSearchResult() {
  map.removeLayer(searchLayer);
}

function closePoi() {
  document.getElementById("poi").style.display = "none";
  let qstr = getCookie("qstr");
  window.location.href = "#" + qstr;
}

function updateURLPoiId(id) {
  let qstr = getCookie("qstr");
  window.location.href = "#" + qstr + "!" + id;
}

map.on('movestart', function() {
  document.getElementById("popup-context").style.display = "none";
})

function findNearby(z) {
  var pc = document.getElementById("coord");
  var latlon = pc.innerHTML;

  var data;
  if (z >= 17) {
    data = `[out:json][timeout:25];(nwr["amenity"](around: 100, ${latlon});nwr["shop"](around: 100, ${latlon});nwr["office"](around: 100, ${latlon});nwr["leisure"](around: 100, ${latlon});nwr["tourism"](around: 100, ${latlon}););out ids tags center;`

    postOverpass(data, function(json) {
      showPlaces(json)
    })
  }
  else if (z >= 10 && z <= 16){
    data = `[out:json][timeout:25];(node["place"](around: 1000, ${latlon}););out 10;`
    postOverpass(data, function(json) {
      showPlaces(json)
    })
  }
  var pc = document.getElementById("popup-context");
  pc.style.display = "none";
}

map.on("click", function(evt) {

  popupOverlay.setPosition(undefined);

  if (poi_selected_id > -1) {
    console.log(poi_selected_id)
    for(var i in place_features) {
      place_features[i].setStyle(POI_NORMAL_STYLE);
    }
  }

  var found = false
  this.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
    if (feature.getProperties().name == "place") {
      let id = feature.getProperties().id;
      updateURLPoiId(id);

      let r = places_map.filter(x => x[3] == id);
      showPoi(r[0]);
      found = true;


      feature.setStyle(POI_SELECTED_STYLE);
      poi_selected_id = id;
    }
  });
  if (!found) {
    closePoi();
    removeSearchResult();
    poi_selected_id = -1;
  }
  else {
    return;
  }

  const coord = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326')
  if (document.getElementById("dir_from") != null) {
    //nav
    if (acceptingClick == "from") {
      document.getElementById("dir_from").value = toStringCoords(coord);
      setDirectionPoint(coord, "from");
      getRoute();
    }
    else if (acceptingClick == "to") {
      document.getElementById("dir_to").value = toStringCoords(coord);
      setDirectionPoint(coord, "to");
      getRoute();
    }
  }

  const z = map.getView().getZoom();
  let type = ""
  if (z >= 10 && z <= 16) {
    type = "places"
  }
  else if (z >= 17)
  {
    type = "POIs"
  }
  else {
    return;
  }

  var pc = document.getElementById("popup-context");
  pc.style.display = "block";
  pc.innerHTML = "<span id='coord'>" + toStringCoords(coord) + `</span><button onclick='findNearby(${z})'>Nearby ${type}</button>`;
  setClickPoint(coord);
});

let DIR_POINT_STYLE = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 5,
    fill: new ol.style.Fill({
      color: '#7226b5'
    }),
    stroke: new ol.style.Stroke({
      color: '#ffffffcc',
      width: 1,
    }),
  }),

});

let CLICK_POINT_STYLE = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 5,
    fill: new ol.style.Fill({
      color: '#ffe091'
    }),
    stroke: new ol.style.Stroke({
      color: '#b0b0b0',
      width: 2,
    }),
  }),

});

var acceptingClick;
map.on("singleclick", function(evt) {


});


var clickPointLayer;
function setClickPoint(coord) {

  if (clickPointLayer) {
    map.removeLayer(clickPointLayer);
  }

  var feature = new ol.Feature();
  feature.setStyle(CLICK_POINT_STYLE);
  feature.setGeometry( new ol.geom.Point(ol.proj.fromLonLat(coord)));
  clickPointLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: [feature],
    }),
  });
  map.addLayer(clickPointLayer);
}

var directionPointFromLayer;
var directionPointToLayer;

function setDirectionPoint(coord, type) {
  var feature = new ol.Feature();
  feature.setStyle(DIR_POINT_STYLE);
  feature.setGeometry( new ol.geom.Point(ol.proj.fromLonLat([coord[0], coord[1]])));
  const routeLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: [feature],
    }),
  });
  map.addLayer(routeLayer);

  if (type == "from") {

    if (directionPointFromLayer)
      map.removeLayer(directionPointFromLayer);
    directionPointFromLayer = routeLayer;
  }
  else {
    if (directionPointToLayer)
      map.removeLayer(directionPointToLayer);
    directionPointToLayer = routeLayer;
  }
}

function clearDirectionPoints() {
  if (directionPointFromLayer)
    map.removeLayer(directionPointFromLayer);

  if (directionPointToLayer)
    map.removeLayer(directionPointToLayer);
}

function toStringCoords(coord) {
  return coord[1].toFixed(6) + ", " + coord[0].toFixed(6)
}

function showPoi(ele) {

  console.log(ele)

  let [lon, lat, tags, id, type] = ele;

  function addLine(t, d) {
    return `<dt class="col-sm-3">${t}</dt>
  <dd class="col-sm-9 poi_value">${d}</dd>`;
  }

  let name = coalesce(tags.name, "Unnamed");
  let cat = coalesce(tags['shop'], tags['office'], tags['amenity'], tags['tourism'], tags['leisure'], tags['place'], tags['aeroway']).replace(/_/g, " ");

  let latlon = toStringCoords([lon, lat]);

  var str = `<div class="close"><button type="button" class="btn-close" aria-label="Close" onclick="closePoi()"></button></div>`;
  str += `<h2>${name}</h2><h4>${cat}</h4><hr /><dl class="row">`
  if (tags['addr:street']) str += addLine("Address", (tags['addr:street'] ?? '') +" "+ (tags['addr:housenumber'] ?? '') +" "+ (tags['addr:postcode'] ?? ""));

  str += addLine("Coordinates", latlon);

  if (tags['population']) str += addLine("Population", `${tags.population}` + (tags["population:date"] ? `(${tags["population:date"]})` : ""));

  if (tags['opening_hours']) str += addLine("Opening hours", `${tags.opening_hours.replace(/,|;/gi, "<br />")}`);
  if (tags['cuisine']) str += addLine("Cuisine", `${tags.cuisine}`);
  if (tags['brand']) str += addLine("Brand", `${tags.brand}`);
  if (tags['operator']) str += addLine("Operator", `${tags.operator}`);
  if (tags['website']) str += addLine("Website", `<a href='${tags.website}'>${tags.website}</a>`);
  if (tags['email']) str += addLine("Email", `${tags.email}`);
  if (tags['phone']) str += addLine("Phone", `${tags.phone}`);




  if (tags['wheelchair']) str += addLine("Wheelchair", `${tags.wheelchair}`);
  if (tags['description']) str += addLine("Description", `${tags.description}`);

  function createNavigationLink(name, url, latlon) {
    let u = url.replace(/LATLON/g, latlon);
    return `<li><a target=_blank href="${u}">${name}</a></li>`;
  }
  function createNavigationLink2(name, url, lat, lon) {
    let u = url.replace("LAT", lat).replace("LON", lon);
    return `<li><a target=_blank href="${u}">${name}</a></li>`;
  }

  var startCoordStr = "0,0";
  if (lastCoordinate) {
    let center = ol.proj.toLonLat(lastCoordinate);
    startCoordStr = `${center[1]},${center[0]}`;
  }

  let navlinks = [
    "<ul class='list-unstyled'>",
    createNavigationLink("Google Maps", "https://www.google.com/maps/dir/?api=1&destination=LATLON", latlon),
    "</ul>"
  ];

  if (iOS()) {
    navlinks.splice(3, 0, createNavigationLink2("Show in Tracestrack", "https://www.tracestrack.com/point/LAT/LON", lat, lon));
    navlinks.splice(3, 0, createNavigationLink2("OsmAnd", "osmandmaps://navigate?lat=LAT&lon=LON", lat, lon));
    navlinks.splice(3, 0, createNavigationLink2("Magic Earth", "magicearth://?drive_to&lat=LAT&lon=LON", lat, lon));
    navlinks.splice(3, 0, createNavigationLink("Baidu Maps", "baidumap://map/direction?destination=LATLON&coord_type=wgs84&mode=driving", latlon));
    navlinks.splice(3, 0, createNavigationLink("TomTom Go", "tomtomgo://x-callback-url/navigate?destination=LATLON", latlon));
  }

  str += addLine("Directions", navlinks.join(""));

  let edit_link = `https://www.openstreetmap.org/edit?editor=id&${type}=${id}`;

  let permURL = window.location.href;
  str += `<div class="input-group input-group-sm mb-3">

  <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled value="${permURL}" id="permanentURL">
  <div class="input-group-append">
    <button id="btnCopyLink" class="btn btn-outline-secondary" type="button" onclick="copyPermURL()">Copy Link</button>
  </div>
</div>
<small><a target=_blank href=${edit_link}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
</svg> Edit in OpenStreetMap</a></small>`;

  str += `</dl>`;

  document.getElementById("poi").innerHTML = str;
  document.getElementById("poi").style.display = "block";
}

function copyPermURL() {
  var copyText = document.getElementById("permanentURL");
  copyText.select();
  copyText.setSelectionRange(0, 99999); /* For mobile devices */
  document.execCommand("copy");
  document.getElementById("btnCopyLink").innerHTML = "Copied!";
}

function toRad(Value)
{
  return Value * Math.PI / 180;
}

function calcDis(lat1, lon1, lat2, lon2)
{
  var R = 6371; // km
  var dLat = toRad(lat2-lat1);
  var dLon = toRad(lon2-lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d * 1000; // m
}

function resetDirections() {
  if (routeLayer)   {
    map.removeLayer(routeLayer);
    routeLayer = null;
  }
  document.getElementById("directions_result").innerHTML = "";
  document.getElementById("dir_from").value = "";
  document.getElementById("dir_to").value = "";
  acceptingClick = "";
  clearDirectionPoints();
}

var routeLayer;
function getRoute() {

  const to = document.getElementById("dir_to").value;
  const from = document.getElementById("dir_from").value;

  if (to != "" && from != "") {
    acceptingClick = "";
  }
  else {
    return;
  }

  var xhttp = new XMLHttpRequest();

  const c1 = from.replace(/ /g, "").split(",");
  const c2 = to.replace(/ /g, "").split(",");

  let url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf62488c0ecc42793146ce96a0f582119e0812&start=${c1[1]},${c1[0]}&end=${c2[1]},${c2[0]}`;

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {

        if (routeLayer) {
          console.log('rmeove')
          map.removeLayer(routeLayer);
        }

        let json = JSON.parse(this.responseText);

        var polyline = new ol.geom.LineString(json.features[0].geometry.coordinates);
        polyline.transform('EPSG:4326', 'EPSG:3857');

        var summary = json.features[0].properties.summary;
        console.log(summary);

        var distance = parseInt(summary.distance) / 1000;
        var duration = parseInt(summary.duration) / 60;

        document.getElementById("directions_result").innerHTML = `Distance: ${distance.toFixed(2)} kilometers Duration: ${duration.toFixed(0)} minutes`;

        var routeFeature = new ol.Feature();
        routeFeature.setStyle(new ol.style.Style({
          stroke: new ol.style.Stroke({
            width: 5,
            color: "#bc70ff"
          })
        }));

        routeFeature.setGeometry(polyline);
        routeLayer = new ol.layer.Vector({
          source: new ol.source.Vector({
            features: [routeFeature],
          }),
        });
        map.addLayer(routeLayer);
      }
      else {
        alert("route not found");
      }
    }
    else {

    }
  };

  xhttp.open("GET", url, true);
  xhttp.send();
}

var acceptingCurrentLocation;
function useCurrentLocationAsFrom() {

  if (lastCoordinate) {
    document.getElementById("dir_from").value = formatCoordinate(lastCoordinate);
    getRoute();
  }
  else {
    geolocation.setTracking(true);
    acceptingCurrentLocation = "from";
  }
}

function useCurrentLocationAsTo() {
  if (lastCoordinate) {
    document.getElementById("dir_to").value = formatCoordinate(lastCoordinate);
    getRoute();
  }
  else {
    geolocation.setTracking(true);
    acceptingCurrentLocation = "to";
  }
}

function formatCoordinate(c) {
  return toStringCoords(ol.proj.toLonLat(c));
}

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
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

const coalesce = (...args) => args.find(_ => ![undefined, null].includes(_));

var button = document.createElement('button');
button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-fill" viewBox="0 0 16 16">  <path fill-rule="evenodd" d="M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.319 1.319 0 0 0-.37.265.301.301 0 0 0-.057.09V14l.002.008a.147.147 0 0 0 .016.033.617.617 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.619.619 0 0 0 .146-.15.148.148 0 0 0 .015-.033L12 14v-.004a.301.301 0 0 0-.057-.09 1.318 1.318 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465-1.281 0-2.462-.172-3.34-.465-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411z"/></svg>';

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

var RotateNorthControl = new ol.control.Control({
  element: element
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

function isRetina() {
  return getCookie("retina") == "true";
}

var interactions = ol.interaction.defaults({altShiftDragRotate:false, pinchRotate:false});

var subserver = server + '.';
subserver = '';

let base_source = new ol.source.XYZ({
  attributions: [ol.source.OSM.ATTRIBUTION],
  opaque: true,
  imageSmoothing: true,
  cacheSize: 100,
  transition: 10,
  url: 'https://' + subserver + 'tiles.tracestrack.com/base/{z}/{x}/{y}.png',
  crossOrigin: null,
  tilePixelRatio: isRetina() ? 2 : 1
});

base_source.on('tileloaderror', function(event) {
  setTimeout(function(){
    console.log("tile error")
    event.tile.load()
  }, 10000 * Math.random());
});

let base_layer = new ol.layer.Tile({
      preload: Infinity,
      source: base_source,
    })

var map = new ol.Map({
  target: 'map',
  interactions: interactions,
  maxTilesLoading: 8,
  layers: [base_layer],
  controls: [new ol.control.Attribution({collapsible: true})],
  view: new ol.View({
    center: ol.proj.fromLonLat(lonlat),
    zoom: zoom,
    maxZoom: 19,
    constrainResolution: true,
  })
});

map.addControl(RotateNorthControl);

var geolocation = new ol.Geolocation({
  trackingOptions: {
    enableHighAccuracy: true,
  },
  projection: map.getView().getProjection(),
});


var languageLayer;

function setLanguageLayer(label_name) {
  if (languageLayer) {
    map.removeLayer(languageLayer);
  }

  languageLayer = new ol.layer.Tile({
    preload: Infinity,
    source: new ol.source.XYZ({
      opaque: false,
      imageSmoothing: true,
      cacheSize: 100,
      transition: 0,
      url: 'https://' + subserver  + 'tiles.tracestrack.com/' + label_name + '/{z}/{x}/{y}.png',
      crossOrigin: null,
      tilePixelRatio: isRetina() ? 2 : 1
    }),
  });
  map.addLayer(languageLayer);

  setCookie("lang", label_name, 1000);
}

if (getCookie("lang") === "") {
  setCookie("lang", "en-name", 1000);
}

setLanguageLayer(getCookie("lang"));

function setRetinaEnabled(ena) {
  setCookie("retina", ena, 1000);

  if (confirm("It's need to reload the map to take effect. Reload now?")) {
    location.reload();
  }
}

function setServer(s) {
  setCookie("server", s, 1000);

  if (confirm("It's need to reload the map to take effect. Reload now?")) {
    location.reload();
  }
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

function onMoveEnd(evt) {
  var map = evt.map;
  let z = map.getView().getZoom();
  let center = ol.proj.toLonLat(map.getView().getCenter());

  setURL(center, z);

  if (poiLayer) {
    if (z >= 18) {
      poiLayer.setVisible(true);
    }
    else {
      poiLayer.setVisible(false);
    }
  }

  if (z >= 18) {
    if (!lastPoiQueryCenter) {
      postOverpass(center[0], center[1]);
      return;
    }

    let dis = calcDis(center[1], center[0], lastPoiQueryCenter[1], lastPoiQueryCenter[0]);
    console.log(dis);
    if (dis > 300) {
      postOverpass(center[0], center[1]);
    }
  }
}

map.on('moveend', onMoveEnd);

map.on("pointermove", function (evt) {
  var hit = this.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
    return true;
  });
  if (hit) {
    this.getTargetElement().style.cursor = 'pointer';
  } else {
    this.getTargetElement().style.cursor = '';
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
});


function transform(extent) {
  return ol.proj.transformExtent(extent, 'EPSG:4326', 'EPSG:3857');
}

function createSearchFeature(geo) {
  var searchFeature = new ol.Feature();
  searchFeature.setStyle(
    new ol.style.Style({
      image: new ol.style.Circle({
        radius: 10,
        fill: new ol.style.Fill({
          color: '#FFFF0099',
        }),
        stroke: new ol.style.Stroke({
          color: '#ff6600cc',
          width: 4,
        }),
      }),
    })
  );
  searchFeature.setGeometry(geo);
  return searchFeature;
};

function createPoiFeature(geo) {
  var feature = new ol.Feature();
  feature.setStyle(
    new ol.style.Style({
      image: new ol.style.Circle({
        radius: 10,
        fill: new ol.style.Fill({
          color: '#FFFF0011',
        }),
        stroke: new ol.style.Stroke({
          color: '#ff6600cc',
          width: 1,
        }),
      }),
    })
  );
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

  let e = res[0];
  let extent = transform([e.boundingbox[2], e.boundingbox[0],
                          e.boundingbox[3], e.boundingbox[1]]);

  let view = map.getView();
  view.fit(extent);

  var features = res.map(x => createSearchFeature(new ol.geom.Point(ol.proj.fromLonLat([x.lon, x.lat]))));

  updateSearchFeatureLayer(features);
}


var poiLayer;
function updatePoiLayer(features) {

  if (poiLayer) {
    map.removeLayer(poiLayer);
  }

  poiLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: features,
    }),
  });

  map.addLayer(poiLayer);
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

var lastPoiQueryCenter;

function postOverpass(lon, lat) {
  var xhttp = new XMLHttpRequest();

  lastPoiQueryCenter = [lon, lat];
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        let json = JSON.parse(this.responseText);
        showPois(json);
      }
      else {
        lastPoiQueryCenter = null;
      }
    }
  };
  xhttp.open("POST", "https://lz4.overpass-api.de/api/interpreter", true);
  let str = `[out:json][timeout:5];
(
  nwr["tourism"](around: 300, ${lat}, ${lon});
  nw["amenity"](around: 300, ${lat}, ${lon});
  nw["office"](around: 300, ${lat}, ${lon});
  nw["shop"](around: 300, ${lat}, ${lon});
);
out center;
>;`;

  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
  let data = 'data=' + encodeURIComponent(str);
  xhttp.send(data);
}

var poi_map;
function showPois(res) {

  console.log(res);

  poi_map = res.elements.map(x => [x["center"] ? x["center"]["lon"] : x.lon, x["center"] ? x["center"]["lat"] : x.lat, x.tags, x.id]);

  let features = poi_map.map(x => createPoiFeature(new ol.geom.Point(ol.proj.fromLonLat([x[0], x[1]]))));

  updatePoiLayer(features);

  if (selectedPoiId) {
    let found = poi_map.filter(x => x[3] == selectedPoiId);
    showPoi(found[0]);
    selectedPoiId = null;
  }
}

new ol.layer.Vector({
  map: map,
  source: new ol.source.Vector({
    features: [accuracyFeature, positionFeature],
  }),
});


function closePoi() {
  document.getElementById("poi").style.display = "none";
  let qstr = getCookie("qstr");
  window.location.href = "#" + qstr;
}

function updateURLPoiId(id) {
  let qstr = getCookie("qstr");
  window.location.href = "#" + qstr + "!" + id;
}

map.on("click", function(evt) {
  var hit = this.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
    return true;
  });
  if (!hit) {
    closePoi();
    return;
  }

  var coord = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
  var lon = coord[0];
  var lat = coord[1];

  var min_dis = 9999;
  var res_index;
  for (i in poi_map) {
    let k = poi_map[i];
    var a = k[0] - lon;
    var b = k[1] - lat;
    var c = Math.sqrt( a*a + b*b );
    if (c < min_dis) {
      min_dis = c;
      res_index = i
    }
  }

  let id = poi_map[res_index][3];

  updateURLPoiId(id);
  showPoi(poi_map[res_index]);

});

function showPoi(e) {

  console.log(e);
  let [lon, lat, tags, id] = e;

  function addLine(t, d) {
    return `<dt class="col-sm-3">${t}</dt>
  <dd class="col-sm-9 poi_value">${d}</dd>`;
  }

  let name = coalesce(tags.name, "Unnamed");
  let cat = coalesce(tags['shop'], tags['office'], tags['amenity'], tags['tourism']).replace(/_/g, " ");

  let latlon = [lat, lon].join(", ");

  var str = `<div class="close"><button type="button" class="btn-close" aria-label="Close" onclick="closePoi()"></button></div>`;
  str += `<h2>${name}</h2><h4>${cat}</h4><hr /><dl class="row">`
  if (tags['addr:street']) str += addLine("Address", (tags['addr:street'] ?? '') +" "+ (tags['addr:housenumber'] ?? '') +" "+ (tags['addr:postcode'] ?? ""));

  str += addLine("Coordinates", latlon);
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
    let u = url.replace("LATLON", latlon);
    return `<li><a href="${u}">${name}</a></li>`;
  }
  function createNavigationLink2(name, url, lat, lon) {
    let u = url.replace("LAT", lat).replace("LON", lon);
    return `<li><a href="${u}">${name}</a></li>`;
  }

  let navlinks = [
    "<ul class='list-unstyled'>",
    createNavigationLink("Google Maps", "https://www.google.com/maps/dir/?api=1&destination=LATLON", latlon),
    createNavigationLink("Waze", "https://www.waze.com/ul?ll=LATLON&navigate=yes", latlon),
    "</ul>"
  ];

  if (iOS()) {
    navlinks.splice(3, 0, createNavigationLink2("OsmAnd", "osmandmaps://navigate?lat=LAT&lon=LON", lat, lon));
    navlinks.splice(3, 0, createNavigationLink2("Magic Earth", "magicearth://?drive_to&lat=LAT&lon=LON", lat, lon));
    navlinks.splice(3, 0, createNavigationLink("Baidu Maps", "baidumap://map/direction?destination=LATLON&coord_type=wgs84&mode=driving", latlon));
    navlinks.splice(3, 0, createNavigationLink("TomTom Go", "tomtomgo://x-callback-url/navigate?destination=LATLON", latlon));
  }


  str += addLine("Directions", navlinks.join(""));

  let permURL = window.location.href;
  str += `<div class="input-group input-group-sm mb-3">

  <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled value="${permURL}" id="permanentURL">
  <div class="input-group-append">
    <button class="btn btn-outline-secondary" type="button" onclick="copyPermURL()">Copy Link</button>
  </div>
</div>`;

  str += `</dl>`;

  document.getElementById("poi").innerHTML = str;
  document.getElementById("poi").style.display = "block";
}

function copyPermURL() {

  var copyText = document.getElementById("permanentURL");
  /* Select the text field */
  copyText.select();
  copyText.setSelectionRange(0, 99999); /* For mobile devices */

  /* Copy the text inside the text field */
  document.execCommand("copy");

  /* Alert the copied text */
  alert("URL copied");
}

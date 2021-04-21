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

if (window.location.href.indexOf("#") > 0) {
  qstr = window.location.href.split("#")[1];
}
else {
  qstr = getCookie("qstr");
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
  opaque: false,
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

var map = new ol.Map({
  target: 'map',
  interactions: interactions,
  layers: [
    new ol.layer.Tile({
      preload: Infinity,
      source: base_source,
    }),
  ],
  controls: ol.control.defaults({attribution: false}).extend([new ol.control.Attribution({collapsible: false})]),
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
  window.location.href = "#" + qstr;

  setCookie("qstr", qstr, 1000);
}

function onMoveEnd(evt) {
  var map = evt.map;
  setURL(ol.proj.toLonLat(map.getView().getCenter()), map.getView().getZoom());
}

map.on('moveend', onMoveEnd);

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


new ol.layer.Vector({
  map: map,
  source: new ol.source.Vector({
    features: [accuracyFeature, positionFeature],
  }),
});

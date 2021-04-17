var button = document.createElement('button');
button.innerHTML = 'O';

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

var interactions = ol.interaction.defaults({altShiftDragRotate:false, pinchRotate:false});

var map = new ol.Map({
  target: 'map',
  interactions: interactions,
  layers: [
    new ol.layer.Tile({
      source: new ol.source.XYZ({
        attributions: [
          '© OpenStreetMap contributors'],
        opaque: true,
        url: 'https://tiles.tracestrack.com/base/{z}/{x}/{y}.png',
        crossOrigin: null,
        tilePixelRatio: 1,
      }),
    }),
  ],
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
    source: new ol.source.XYZ({
      attributions: [
          '© OpenStreetMap contributors'],
      opaque: false,
      url: 'https://tiles.tracestrack.com/' + label_name + '/{z}/{x}/{y}.png',
      crossOrigin: null,
      tilePixelRatio: 2,
    }),
  });
  map.addLayer(languageLayer);
}

setLanguageLayer("en-name");

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

new ol.layer.Vector({
  map: map,
  source: new ol.source.Vector({
    features: [accuracyFeature, positionFeature],
  }),
});

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

console.log();

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
        opaque: false,
        url: 'https://tiles.tracestrack.com/base/{z}/{x}/{y}.png',
        crossOrigin: null,
        tilePixelRatio: 2,
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


function wrapLon(value) {
  var worlds = Math.floor((value + 180) / 360);
  return value - worlds * 360;
}

function setURL(lonlat, zoom) {
  let qstr = zoom.toFixed(0) + "/" + lonlat[1].toFixed(4) + "/" + lonlat[0].toFixed(4)
  window.location.href = "#" + qstr;

  setCookie("qstr", qstr, 1000);
}

function onMoveEnd(evt) {
  var map = evt.map;
  setURL(ol.proj.toLonLat(map.getView().getCenter()), map.getView().getZoom());

  /*
  var extent = map.getView().calculateExtent(map.getSize());
  var bottomLeft = ol.proj.toLonLat(ol.extent.getBottomLeft(extent));
  var topRight = ol.proj.toLonLat(ol.extent.getTopRight(extent));
  console.log(wrapLon(bottomLeft[0]));
  console.log(bottomLeft[1]);
  console.log( wrapLon(topRight[0]));
  console.log(topRight[1]);*/
}

map.on('moveend', onMoveEnd);

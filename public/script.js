var map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.XYZ({
        attributions: [
          'All maps © <a href="http://www.openseamap.org/">OpenSeaMap</a>',
          "XX" ],
        opaque: false,
        url: 'https://tiles.tracestrack.com/base/{z}/{x}/{y}.png',
        crossOrigin: null,
        tilePixelRatio: 2,
      }),
    }),
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([37.41, 8.82]),
    zoom: 4
  })
});

function addLayer(label_name) {
  map.addLayer(new ol.layer.Tile({
      source: new ol.source.XYZ({
        attributions: [
          'All maps © <a href="http://www.openseamap.org/">OpenSeaMap</a>',
          "XX" ],
        opaque: false,
        url: 'https://tiles.tracestrack.com/en-name/{z}/{x}/{y}.png',
        crossOrigin: null,
        tilePixelRatio: 2,
      }),
  }));
  /*
  map.getLayers().forEach(layer => {
    if (layer) {
      map.removeLayer(layer);
    }
  });*/
}

reloadMap("en-name");

/*
  new ol.layer.Tile({
  source: new ol.source.XYZ({
  attributions: [
  'All maps © <a href="http://www.openseamap.org/">OpenSeaMap</a>',
  "XX" ],
  opaque: false,
  url: 'https://tiles.tracestrack.com/' + label_name + '/{z}/{x}/{y}.png',
  crossOrigin: null,
  tilePixelRatio: 2,
  }),
  }),
*/

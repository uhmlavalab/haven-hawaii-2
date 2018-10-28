import * as L from 'leaflet';

export const Locations = {
  'Oahu': {
    center: new L.LatLng(21.480066, -157.96),
    zoom: 11,
  },
  'Maui': {
    center: new L.LatLng(21.480066, -157.96),
    zoom: 11,
  },
};

export const BaseLayers = {
  'Street': L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      maxZoom: 18,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }),
  'Satellite': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
      maxZoom: 18,
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }),
  'Terrain': L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    {
      maxZoom: 18,
      attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    })
};

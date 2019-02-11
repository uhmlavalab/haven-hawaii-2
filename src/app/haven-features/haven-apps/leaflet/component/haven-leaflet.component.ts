import { Component, OnInit } from '@angular/core';

import * as L from 'leaflet';

import { isUndefined } from 'util';

import { HavenApp } from '../../shared/haven-app';
import { HavenWindow } from '../../../haven-window/shared/haven-window';
import { LeafletAppInfo } from '../shared/leaflet-app-info';
import { LayersService, DatabaseSqlService } from '@app/haven-core';

@Component({
  selector: 'app-haven-leaflet',
  templateUrl: './haven-leaflet.component.html',
  styleUrls: ['./haven-leaflet.component.css']
})
export class HavenLeafletComponent implements OnInit {

  havenWindow: HavenWindow;
  appInfo: LeafletAppInfo;
  havenApp: HavenApp;

  leafletMap: L.Map;
  layerColorInfo = {};
  loaded = false;

  layersControl = {
    baseLayers: {
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
    },
    overlays: {}
  };
  locations = {
    'Oahu': {
      center: new L.LatLng(21.480066, -157.96),
      zoom: 11,
    },
    'Maui': {
      center: new L.LatLng(21.480066, -157.96),
      zoom: 11,
    },
  };
  options = {
    layers: [
      this.layersControl.baseLayers.Street
    ],
    zoom: this.locations.Oahu.zoom,
    center: this.locations.Oahu.center
  };

  colors = {
    'dod': 'red',
    'agriculture': 'green',
    'existing_renewable': 'cyan',
    'solar': 'orange',
    'transmission:': 'white'
  }


  constructor(private layersService: LayersService, private dbSql: DatabaseSqlService) {

  }



  ngOnInit() {
    this.appInfo = this.havenApp.appInfo;
    this.options.zoom = this.appInfo.zoom;
    this.options.center = L.latLng(this.appInfo.lat, this.appInfo.lng);
    this.layersService.getLayers('deafult').then(data => {
      this.dbSql.getSolarTotalYear(this.appInfo.scenarioId, this.appInfo.year).then(solarTotal => {
        data.forEach(layer => {
          const name = layer.name.split('.')[0];
          let solarTot = solarTotal;
          this.layersControl.overlays[name] = L.geoJSON(layer.data, {
            style: (feature) => {
              if (name == 'solar') {
                if (solarTot > 0) {
                  const cf = feature.properties.cf_1;
                  const capacity = feature.properties.capacity;
                  const value = (cf * capacity * 8760);;
                  solarTot -= value;
                  return {
                    color: 'transparent',
                    fillColor: this.colors[name],
                    fillOpacity: 0.75
                  };
                } else {
                  return {
                    color: 'transparent',
                    fillColor: 'white',
                    fillOpacity: 0.75
                  };
                }
              } else {
                return {
                  color: this.colors[name],
                  fillColor: this.colors[name]
                };
              }

            }
          });
        });
        this.loaded = true;
      });

    })

  }

  setMap(leafletMap: L.Map) {
    this.leafletMap = leafletMap;
    this.leafletMap.setView(this.options.center, this.options.zoom);
    let startLayer = this.appInfo.baseLayerName as string;
    startLayer = startLayer.charAt(0).toUpperCase() + startLayer.slice(1);
    console.log(startLayer);
    this.leafletMap.addLayer(this.layersControl.baseLayers[startLayer]);

    this.leafletMap.on('zoomend', () => {
      this.appInfo.zoom = this.leafletMap.getZoom();
    });
    this.leafletMap.on('moveend', () => {
      this.appInfo.lat = this.leafletMap.getCenter().lat;
      this.appInfo.lng = this.leafletMap.getCenter().lng;
    });
  }

  resize() {
    if (this.loaded) {
      this.leafletMap.invalidateSize();
    }
  }


  // updateSupplyLayerColor(layerName: string, supplyAmount: number) {
  //   let supply = supplyAmount;
  //   const colorSelected = this.layerColorInfo[layerName]['color'];
  //   const colorShaded = this.lightenColor(colorSelected);
  //   const organizedByMWac = [];
  //   Object.keys(this.layersControl.overlays[layerName]['_layers']).forEach(layer => {
  //     const layerProperties = this.layersControl.overlays[layerName]['_layers'][layer]['feature']['properties'];
  //     const MWac = layerProperties['capacity'];
  //     const cf = layerProperties['cf'];
  //     const total = MWac * cf * 8760;
  //     organizedByMWac.push({ 'total': total, 'layer': layer });

  //   });
  //   console.log(colorSelected, layerName, supplyAmount);
  //   organizedByMWac.sort((a, b) => parseFloat(b.total) - parseFloat(a.total));
  //   organizedByMWac.forEach(element => {
  //     if (supply > 0) {
  //       this.layersControl.overlays[layerName]['_layers'][element.layer]['options']['color'] = colorSelected;
  //       this.layersControl.overlays[layerName]['_layers'][element.layer]['options']['weight'] = 1;
  //       supply -= element.total;
  //     } else {
  //       this.layersControl.overlays[layerName]['_layers'][element.layer]['options']['color'] = colorShaded;
  //       this.layersControl.overlays[layerName]['_layers'][element.layer]['options']['weight'] = 1;
  //     }
  //   });
  //   this.loaded = true;
  // }




}

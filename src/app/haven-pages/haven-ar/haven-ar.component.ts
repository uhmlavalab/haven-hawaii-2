import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

import { LeafletArService, LayerDownloadService, PortfolioService, LayersService } from '@app/haven-core';

import { LeafletAppInfo } from '@app/haven-features';

@Component({
  selector: 'app-haven-ar',
  templateUrl: './haven-ar.component.html',
  styleUrls: ['./haven-ar.component.css']
})
export class HavenArComponent implements OnInit {

  leafletMap: L.Map;
  layerColorInfo = {};
  loaded = false;

  baseLayers = {
    'Street': L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }),
  };

  layersControl = {
    baseLayers: this.baseLayers,
    overlays: {}
  };

  options = {
    layers: [
      this.baseLayers.Street
    ],
    zoom: 11.5,
    zoomSnap: 0.1,
    center: L.latLng([21.480066, -157.96])
  };

  constructor(private leafleArService: LeafletArService, private layerDownloadService: LayerDownloadService, private layersService: LayersService, private portfolioService: PortfolioService) {
    leafleArService.arSub.subscribe(update => {

      this.portfolioService.getPortfolioRef(update.portfolio).collection('layers').onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const name = doc.data()['name'];
          const color = doc.data()['color'];
          const profiles = doc.data()['profiles'];
          if (this.layersControl.overlays.hasOwnProperty(name)) {
            this.layerColorInfo[name]['color'] = color;
            this.layerColorInfo[name]['profiles'] = profiles;
            this.layerColorInfo[name]['name'] = name;
          } else {
            this.layerColorInfo[name] = { 'name': name, 'profiles': profiles, 'color': color };
          }
          if (this.layerColorInfo[name]['profiles'].length > 0 && this.loaded) {
            this.updateSupplyLayerColor(name, this.layerColorInfo[name]['supplyAmount']);
          } else if (this.loaded) {
            this.layersControl.overlays[name].setStyle({ 'color': color });
          }
        });
      });

      this.layerDownloadService.getLayers(update.portfolio).then((layers) => {
        let waitForLayerColors = false;
        this.leafletMap.eachLayer((layer) => {
          this.leafletMap.removeLayer(layer);
        });
        const baselayer = L.tileLayer(update.baselayer);
        this.leafletMap.addLayer(baselayer);
        layers.forEach(layer => {
          if (layer) {
            if (this.layerColorInfo[layer.name]['profiles'].length > 0) {
              waitForLayerColors = true;
              const appInfo = new LeafletAppInfo(update.portfolio, update.scenario, update.year, 0, 0, 0, null);
              console.log(appInfo);
              this.layersService.getSupplyOfProfiles(appInfo, this.layerColorInfo[layer.name]['profiles']).then((supplyAmount) => {
                this.layerColorInfo[layer.name]['supplyAmount'] = supplyAmount;
                this.updateSupplyLayerColor(layer.name, supplyAmount);
                if (update.layers) {
                  if (update.layers.indexOf(layer.name) !== -1) {
                    this.leafletMap.addLayer(newLayer);
                  }
                }
              });
            }
            const newLayer = L.geoJSON(layer.data, {
              style: (feature) => ({
                color: this.layerColorInfo[layer.name]['color']
              }),
            });
            this.layersControl.overlays[layer.name] = newLayer;
            if (update.layers && this.layerColorInfo[layer.name]['profiles'].length <= 0) {
              if (update.layers.indexOf(layer.name) !== -1) {
                this.leafletMap.addLayer(newLayer);
              }
            }
          }
        });
        if (!waitForLayerColors) {
          this.loaded = true;
        }
      });

    });
  }

  ngOnInit() {
  }

  setMap(leafletMap: L.Map) {
    this.leafletMap = leafletMap;
    this.leafletMap.setView(this.options.center, this.options.zoom);

    this.leafletMap.removeLayer(this.options.layers[0]);
    this.leafletMap.addLayer(this.baseLayers['Street']);
  }

  updateSupplyLayerColor(layerName: string, supplyAmount: number) {
    let supply = supplyAmount;
    const colorSelected = this.layerColorInfo[layerName]['color'];
    const colorShaded = this.lightenColor(colorSelected);
    const organizedByMWac = [];
    Object.keys(this.layersControl.overlays[layerName]['_layers']).forEach(layer => {
      const layerProperties = this.layersControl.overlays[layerName]['_layers'][layer]['feature']['properties'];
      const MWac = layerProperties['capacity'];
      const cf = layerProperties['cf'];
      const total = MWac * cf * 8760;
      organizedByMWac.push({ 'total': total, 'layer': layer });

    });
    console.log(colorSelected, layerName, supplyAmount);
    organizedByMWac.sort((a, b) => parseFloat(b.total) - parseFloat(a.total));
    organizedByMWac.forEach(element => {
      if (supply > 0) {
        this.layersControl.overlays[layerName]['_layers'][element.layer]['options']['color'] = colorSelected;
        this.layersControl.overlays[layerName]['_layers'][element.layer]['options']['weight'] = 1;
        supply -= element.total;
      } else {
        this.layersControl.overlays[layerName]['_layers'][element.layer]['options']['color'] = colorShaded;
        this.layersControl.overlays[layerName]['_layers'][element.layer]['options']['weight'] = 1;
      }
    });
    this.loaded = true;
  }

  lightenColor(color) {
    let colorValue = '';
    if (color.length <= 7) {
      colorValue = color + '25';
    } else {
      colorValue = color.slice(8, color.length) + '25';
    }
    return colorValue;
  }


}

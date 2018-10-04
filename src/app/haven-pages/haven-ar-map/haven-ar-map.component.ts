import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import * as L from 'leaflet';

import { HavenDialogService } from '@app/haven-shared';

@Component({
  selector: 'app-haven-ar-map',
  templateUrl: './haven-ar-map.component.html',
  styleUrls: ['./haven-ar-map.component.css']
})
export class HavenArMapComponent implements OnInit {

  leafletMap: L.Map;

  baseLayers = {
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
      }),
      'WaterColor': L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}',
      {
        maxZoom: 16,
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        ext: 'png'
      }),
  };

  layersControl = {
    baseLayers: this.baseLayers,
    overlays: {}
  };

  options = {
    layers: [
      this.baseLayers.WaterColor
    ],
    zoom: 11,
    center: L.latLng([21.480066, -157.96])
  };

  constructor(private router: Router, private dialogService: HavenDialogService) { }

  ngOnInit() {
  }

  navigateBackHome() {
    this.dialogService.openConfirmationMessage(`Are you sure want to navigate to the Home Page?`)
    .afterClosed()
    .subscribe(result => {
      if (result) {
        this.router.navigate(['/home']);
      }
    });
  }

  setMap(leafletMap: L.Map) {
    this.leafletMap = leafletMap;
  }

  onResize() {
    this.leafletMap.invalidateSize();
  }

}

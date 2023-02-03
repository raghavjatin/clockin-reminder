import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { BackgroundGeolocationConfig } from '@ionic-native/background-geolocation';
import {
  GoogleMap,
  MapInfoWindow,
  MapGeocoder,
  MapGeocoderResponse,
} from '@angular/google-maps';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('search')
  public searchElementRef!: ElementRef;
  @ViewChild('myGoogleMap', { static: false })
  map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false })
  info!: MapInfoWindow;

  address = '';
  latitude!: any;
  longitude!: any;
  zoom = 12;
  maxZoom = 15;
  minZoom = 8;
  center!: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    mapTypeId: 'hybrid',
  };
  markers = [] as any;

  name = 'Angular';
  public currLat: number | undefined;
  public currLng: number | undefined;

  config: BackgroundGeolocationConfig = {
    desiredAccuracy: 10,
    stationaryRadius: 20,
    distanceFilter: 30,
    debug: true, //  enable this hear sounds for background-geolocation life-cycle.
    stopOnTerminate: false, // enable this to clear background location settings when the app terminates
  };

  constructor(private ngZone: NgZone, private geoCoder: MapGeocoder) {
    this.getLocation();
  }
  // constructor(private ngZone: NgZone, private geoCoder: MapGeocoder) {}

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (position) {
          this.currLat = position.coords.latitude;
          this.currLng = position.coords.longitude;
          console.log(
            'Latitude: ' +
              position.coords.latitude +
              'Longitude: ' +
              position.coords.longitude
          );
        }
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  getAddress(latitude: any, longitude: any) {
    this.geoCoder
      .geocode({ location: { lat: latitude, lng: longitude } })
      .subscribe((addr: MapGeocoderResponse) => {
        if (addr.status === 'OK') {
          if (addr.results[0]) {
            this.zoom = 12;
            this.address = addr.results[0].formatted_address;
          } else {
            this.address = '';
            window.alert('No results found');
          }
        } else {
          this.address = '';
          window.alert('Geocoder failed due to: ' + addr.status);
        }
      });
  }
}

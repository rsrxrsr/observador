import { Component, ElementRef} from '@angular/core';
import { App,IonicPage,NavController,NavParams } from 'ionic-angular';

import { CasosPage } from '../casos/casos';
import { app } from 'firebase';


//import { Geolocation, Geoposition } from '@ionic-native/geolocation';

declare var google;

//@IonicPage()
@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html'
})
export class MapaPage {
  map: any;
  item:any;

//  @ViewChild("map") mapEle:ElementRef;

  constructor(
    private app:App,
    private navCtrl: NavController,
    private navParams: NavParams,
    //private geolocation: Geolocation
  ) {
    this.item=navParams.data;
    console.log("Item",this.item);
  }

  ionViewDidLoad(){
    //this.getPosition();
    this.loadMap();
  }
  
  closePage(){
    this.app.getRootNav().setRoot(CasosPage);
  }

  getPosition():any{
    /*  
    this.geolocation.getCurrentPosition()
    .then(response => {
      this.loadMap(response);
    })
    .catch(error =>{
      console.log(error);
    })
    */
  }
 
  loadMap(){
    //loadMap(position: Geoposition){
    //let latitude = position.coords.latitude;
    //let longitude = position.coords.longitude;
    //let latitude = 43.5293;
    //let longitude = -5.6773;
    let longitude = Number(this.item.longitude);
    let  latitude = Number(this.item.latitude);

    console.log(latitude, longitude);

    // create a new map by passing HTMLElement
     let mapEle: HTMLElement = document.getElementById('map');
    //console.log(mapEle.id,mapEle.innerHTML);

    // create LatLng object
    let myLatLng = {lat: latitude, lng: longitude};

    // create map
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 12
    });

    console.log(this.map);

    var marker = new google.maps.Marker({
//    position: {lat: 43.542194, lng: -5.676875},
      position: myLatLng,
      map: this.map,
      title: 'Hola aqui'
    });

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEle.classList.add('show-map');
      google.maps.event.trigger(mapEle, 'resize');
    });

//New Region
    var verticesPoligono = [
      { lat: 41.05, lng: -4.79 },
      { lat: 40.39, lng: -6.09 },
      { lat: 39.29, lng: -5.85 },
      { lat: 38.39, lng: -4.09 },
      { lat: 38.94, lng: -2.59 },
      { lat: 40.09, lng: -3.12 },
      { lat: 40.95, lng: -3.99 }
    ];

    var poligono = new google.maps.Polygon({
      path: verticesPoligono,
      map: this.map,
      strokeColor: 'rgb(255, 0, 0)',
      fillColor: 'rgb(255, 255, 0)',
      strokeWeight: 4,
    });

    let poly = new google.maps.Polyline({
      strokeColor: '#000000',
      strokeOpacity: 1.0,
      strokeWeight: 3
    });
    poly.setMap(this.map);

    // Add a listener for the click event
    this.map.addListener('click', addLatLng);

    // Handles click events on a map, and adds a new point to the Polyline.
    function addLatLng(event) {
      var path = poly.getPath();

      // Because path is an MVCArray, we can simply append a new coordinate
      // and it will automatically appear.
      path.push(event.latLng);

      // Add a new marker at the new plotted point on the polyline.
      let marker = new google.maps.Marker({
        position: event.latLng,
        title: '#' + 'path.getLength()',
        map: this.map
      });
    }


    /*    

    google.maps.event.addListener(this.map, "click", function(event) {
      alert(event.latLng);
      });

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      let marker = new google.maps.Marker({
        position: myLatLng,
        map: this.map,
        title: 'Hello World!'
      });
      mapEle.classList.add('show-map');
    });
    */
  }
}
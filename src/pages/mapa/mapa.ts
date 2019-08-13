import { Component, ElementRef} from '@angular/core';
import { IonicPage,NavController,NavParams } from 'ionic-angular';

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
    let latitude = Number(this.item.longitude);
    let longitude = Number(this.item.latitude);
    console.log(latitude, longitude);

    //latitude = 19.4978;
    //longitude =  -99.1269;

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
    /*    
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
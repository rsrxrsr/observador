import { Component} from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';

declare var google;

//@IonicPage()
@Component({
  selector: 'page-maper',
  templateUrl: 'maper.html'
})
export class maperPage {
  map: any;
  item:any;
  poly:any;
  path:any;
  marker=[];

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams
  ) {
    this.item=navParams.get('item')
    console.log("Constructor",this.item);
  }

  ionViewDidLoad(){
    console.log("ionViewDidLoad");
    console.log("This", this);
    this.loadMap();
  }
 
  loadMap(){
    console.log("LoadMap", this.item);
    let latitude = Number(this.item.latitude);
    let longitude = Number(this.item.longitude);
    let myLatLng = {lat: latitude, lng: longitude};
    //let myLatLng = {lat: 19.3624966, lng: -99.1838139};
    console.log( " Coord", myLatLng);
     
    // create a new map by passing HTMLElement
    let mapEle: HTMLElement = document.getElementById('map1');

    // create map
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 12
    });
    // crete marker
    this.marker[0] = new google.maps.Marker({
      position: myLatLng,
      map: this.map,
      title: 'Centro'
    });

   // 
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEle.classList.add('show-map');
      google.maps.event.trigger(mapEle, 'resize');
    });

    /*    
    google.maps.event.addListener(this.map, "click", function(event) {
      alert(event.latLng);
      });
    */      

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

    this.  poly = new google.maps.Polyline({
      strokeColor: '#000000',
      strokeOpacity: 1.0,
      strokeWeight: 3
    });
    
    this. poly.setMap(this.map);

    // Add a listener for the click event
    this.map.addListener('click', event => { 
      console.log('addLatLng');
      console.log("this", this);
      console.log("Page", maperPage);
  
      let path = this. poly. getPath();
  
      // Because path is an MVCArray, we can simply append a new coordinate
      // and it will automatically appear.
      path.push(event.latLng);
  
  
      path.getArray().forEach(c => {
        console.log("c",c.lat(),c.lng());  
      });
  
      // Add a new marker at the new plotted point on the polyline.
      this.marker[this.marker.length] = new google.maps.Marker({
        position: event.latLng,
        title: '#' + path.getLength(),
        map: this.map
      });

      console.log("mark",this.marker.length);
    })

  }
  
  undo(){
    if(this.marker.length==1) return;
    this.poly.getPath().pop();
    this.marker[this.marker.length-1].setMap(null);
    this.marker.pop(); 
  }

  limpiar(){
    this.poly.getPath().clear();
    for (let i=1;i<this.marker.length;i++){
      this.marker[i].setMap(null);
    }
    this.marker.splice(1,this.marker.length-1);
  }

}
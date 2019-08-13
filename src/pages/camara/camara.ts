import { Component } from '@angular/core';
//import { NavController } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
//import { VideoCapturePlus, VideoCapturePlusOptions, MediaFile } from '@ionic-native/video-capture-plus/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { NavParams } from 'ionic-angular';


import { ServicioFirebase } from '../../servicios/firebase.servicio';
@Component({
  selector: 'page-camara',
  templateUrl: 'camara.html'
})
export class CamaraPage {

  foto : any;
  file: any;
  imagen:any;
  coords : any;
  latitud: any;
  longitud: any;
  currentImage:any;
  doc:any;
  url="https://firebasestorage.googleapis.com/v0/b/observatorio-d6ad7.appspot.com/o/casos%2Fevidencias%2Faccidente.jpg?alt=media&token=abf0dad0-e73c-464c-a1d6-7554cc4969d9";
  url2="https://firebasestorage.googleapis.com/v0/b/observatorio-d6ad7.appspot.com/o/casos%2Fevidencias%2Fevidencia2.jpg?alt=media&token=ad01a848-902f-4c5f-bd51-1ebe8e1d1cf9";
  url3="https://firebasestorage.googleapis.com/v0/b/observatorio-d6ad7.appspot.com/o/casos%2Fevidencias%2Fevidencia3.jpg?alt=media&token=c58e01ba-80c3-4cd7-b344-c454a43cc321";
  url4="https://firebasestorage.googleapis.com/v0/b/observatorio-d6ad7.appspot.com/o/casos%2Fevidencias%2Fevidencia4.jpg?alt=media&token=74f7de70-2136-47ce-af92-78a63921c729";
  constructor(
    private camera : Camera,
    private geolocation: Geolocation,
    private servicioFirebase : ServicioFirebase,
    private sanitizer : DomSanitizer,
    public navParams:NavParams
  //  private videoCapturePlus: VideoCapturePlus) 
  ){
    this.doc = navParams.data;
    this.url2 =this.doc.urlPhoto;
  }

  getEvidencia() {
    this.getFoto();
    this.getLocation();
  }
 
  takePicture1(){
    let options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 1000,
      targetHeight: 1000,
      quality: 100
    }
    this.camera.getPicture( options )
    .then(imageData => {
      //this.currentImage = 'data:image/jpeg;base64,${imageData}';
      this.currentImage = 'data:image/jpeg;base64,' + imageData;
    })
    .catch(error =>{
      console.log( error );
    });
  }
//
  getFoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    console.log("Camera click:");
    this.camera.getPicture(options).then((imageData) => {
        //Send the picture to Firebase Storage
        this.foto = 'data:image/jpeg;base64,' + imageData;        
        //this.foto = imageData;
        this.servicioFirebase.fileUpload(imageData);
    }, (err) => {
     // Handle error
     console.log("Camera issue:" + err);
    });
  }

  fileUpload(event) {
    this.file = event.target.files[0];
    console.log("File:",this.file);
    this.getImagen(this.file);
    //this.imagen = 'data:image/jpg;base64, '+ this.file; 
    //this.imagen = 'data:image/jpeg;data_url,' + this.file; 
    //this.servicioFirebase.fileUpload(this.file);
  }
//
  getLocation() {
    const options : any = {
       enableHighAccuracy : false,
       timeout : 3000,
       maximumAge : 0
    }
    this.geolocation.getCurrentPosition(options).then((resp) => {       
      this.coords   = resp.coords;
      this.latitud  = this.coords.latitude;
      this.longitud = this.coords.longitude;
      console.log('Latitude',  this.coords.latitude);
      console.log('Longitude', this.coords.longitude);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
    let watch = this.geolocation.watchPosition();
    watch.subscribe((resp) => {
      this.coords = resp.coords;
      this.latitud  = this.coords.latitude;
      this.longitud = this.coords.longitude;
      console.log('Latitude',  this.coords.latitude);
      console.log('Longitude', this.coords.longitude);
    });
  }
  getImagen(data) {
    if(data != null) {
        var imageData = btoa(data);
        //this.imagen = this.sanitizer.bypassSecurityTrustUrl("data:image/jpeg;base64,"+imageData);
        this.imagen = this.sanitizer.bypassSecurityTrustResourceUrl("data:image/jpeg;base64,"+imageData);
        console.log("Base64 Image: ",this.imagen);
    }
  }
//
  /*
  getVideo() {
    const options: VideoCapturePlusOptions = {
      limit: 1,
      highquality: true,
      portraitOverlay: 'assets/img/camera/overlay/portrait.png',
      landscapeOverlay: 'assets/img/camera/overlay/landscape.png'
    }  

    this.videoCapturePlus.captureVideo(options)
    .then((mediafile : MediaFile[]) =>
      console.log(mediafile), error => console.log('Something went wrong')
    );
  }
 */
}

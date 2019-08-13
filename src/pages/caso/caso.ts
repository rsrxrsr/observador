import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { ServicioFirebase } from '../../servicios/firebase.servicio';

import { CasosPage } from '../casos/casos';

@Component({
  selector: 'page-caso',
  templateUrl: 'caso.html'
})
export class CasoPage {

  coleccion="caso";
  isUpdate=false; 
  createSuccess = false;
  doc={id:''};
  //url="https://firebasestorage.googleapis.com/v0/b/observatorio-d6ad7.appspot.com/o/casos%2Fevidencias%2Ffile.jpg?alt=media&token=93a10744-7775-4ea3-b1ae-bfb9740dccda";
  url="https://firebasestorage.googleapis.com/v0/b/observatorio-d6ad7.appspot.com/o/casos%2Fevidencias%2Faccidente.jpg?alt=media&token=abf0dad0-e73c-464c-a1d6-7554cc4969d9";

  constructor(
    private servicioFirebase: ServicioFirebase,
    private nav: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController
    ) {
      if (navParams.data) {
        this.isUpdate = true;
        this.doc = navParams.data;
      } else
      if (navParams.get('item')) {
        this.isUpdate = true;
        this.doc = navParams.get('item');
      }    
      console.log("caso",this.doc);
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Page');
  }

  public register() {
    {
      this.servicioFirebase.agregarDocumento(this.coleccion, this.doc ); 
      this.showPopup("Success", "Document created.");
    }
  }

  public editar() {
    this.servicioFirebase.editarDocumento (this.coleccion, this.doc.id, this.doc );
    this.showPopup("Success", "Document update."); 
  }

  public borrar() {
    this.servicioFirebase.eliminarDocumento (this.coleccion, this.doc.id );  
    this.showPopup("Success", "Document delete."); 
  }

  public showImagen() {
    this.nav.parent.select(1);
/*
    document.getElementById('idMarco').hidden = false;
    var imagen = document.createElement("img");
    console.log("Img",imagen); 
    imagen.src=this.url; 
    var marco = document.getElementById("marco"); 
    marco.appendChild(imagen);
*/     
  }

  public salir() {
    //this.nav.pop();
    this.nav. setRoot(CasosPage);
  }

  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            if (this.createSuccess) {
              this.nav.popToRoot();
            }
          }
        }
      ]
    });
    alert.present();
  }

}
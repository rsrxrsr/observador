import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ServicioFirebase } from '../../servicios/firebase.servicio';

@IonicPage()
@Component({
  selector: 'page-accion',
  templateUrl: 'accion.html',
})
export class AccionPage {

  coleccion="acciones";
  isUpdate=false; 
  createSuccess = false;
  doc = {id:""};
  delta:any; 

  constructor(
    private servicioFirebase: ServicioFirebase,
    private nav: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController
    ) {
      if (navParams.get('item')) {
        this.isUpdate = true;
        this.doc=navParams.get('item'); 
      } else {
        this.doc['estatus']="Activo";
      }
      this.delta = navParams.get('delta');
      this.doc['idCaso']=this.delta.idCaso;
      this.doc['idRegion']=this.delta.idRegion;
      this.doc['idObservador']=this.delta.idObservador;
      console.info("doc",this.doc, "delta", this.delta);
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad accionPage');
   } 
 
  public register() {
    this.servicioFirebase.agregarDocumento(this.coleccion, this.doc );
    this.showPopup("Success", "Document created.");            
  }

  public editar() {
    this.servicioFirebase.editarDocumento (this.coleccion, this.doc.id, this.doc );
    this.showPopup("Success", "Document updated.");          
  }

  public borrar() {
    this.servicioFirebase.eliminarDocumento (this.coleccion, this.doc.id );  
    this.showPopup("Success", "Document delete."); 
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
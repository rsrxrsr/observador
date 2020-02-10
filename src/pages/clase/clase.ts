import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { ServicioFirebase } from '../../servicios/firebase.servicio';

@Component({
  selector: 'page-clase',
  templateUrl: 'clase.html'
})
export class ClasePage {

  coleccion="clases";
  isUpdate=false; 
  createSuccess = false;
  doc={id:''};

  constructor(
    private servicioFirebase: ServicioFirebase,
    private nav: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController
    ) {
      if (navParams.get('item')) {
        this.isUpdate = true;
        this.doc = navParams.get('item');
      }    
      console.log("clase",this.doc);
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Page');
  }

  public register() {
    {
      this.servicioFirebase.agregarDocumento(this.coleccion, this.doc ); 
      this.showPopup("Clasificación", "Documento creado");
    }
  }

  public editar() {
    this.servicioFirebase.editarDocumento (this.coleccion, this.doc.id, this.doc );
    this.showPopup("Clasificación", "Documento actualizado"); 
  }

  public borrar() {
    this.presentConfirm(
      "Confirme Baja",
      "Se borrará el documento",
      ()=> {
        this.servicioFirebase.eliminarDocumento (this.coleccion, this.doc.id )  
        .then(res => {
          this.showPopup("Clasificación", "Documento borrado") 
        }).catch(err =>
          this.showPopup("Clasificación", "Error al borrar")
        );
        this.nav.pop();            
      }
    );
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

  presentConfirm(title:string, message:string, funcion:any) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            funcion();
            console.log('Buy clicked');
          }
        }
      ]
    });
    alert.present();
  }

}
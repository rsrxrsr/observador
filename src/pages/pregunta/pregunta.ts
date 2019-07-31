import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { ServicioFirebase } from '../../servicios/firebase.servicio';

@Component({
  selector: 'page-pregunta',
  templateUrl: 'pregunta.html'
})
export class PreguntaPage {

  public nmColeccion="preguntas";
  coleccion:string;
  padre:string;
  isUpdate=false; 
  createSuccess = false;
  doc={id:''};

  constructor(
    private servicioFirebase: ServicioFirebase,
    private nav: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController
    ) {
      this.coleccion =  navParams.get('ref') ? navParams.get('ref') : this.nmColeccion;
      this.padre = this.getPadre(this.coleccion);
      this.doc = navParams.get('item');
      this.isUpdate = this.doc.id!='';
      console.log(this.coleccion,this.doc);
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Page');
  }

  getPadre(cadena:string) {
    return cadena.substring(0,cadena.indexOf('/'));
  }

  public register() {
    {
      let objeto:any = Object.assign({}, this.doc);
      delete objeto.item;
      this.servicioFirebase.agregarDocumento(this.coleccion, objeto ) 
      .then(res => {
        //this.consultar();
        this.showPopup("Success", "Document update.") 
      }).catch(err => {
        console.log(err);
        this.showPopup("Error", "Document update.")
      });
      }
  }

  public editar() {
    let objeto:any = Object.assign({}, this.doc);
    delete objeto.item;
    this.servicioFirebase.editarDocumento (this.coleccion, this.doc.id, objeto )
    .then(res => {
      this.showPopup("Success", "Document update.") 
    }).catch(err => {
      console.log(err);
      this.showPopup("Error", "Document update.")
    });
  }

  public borrar() {
    this.presentConfirm(
      "Confirme Baja",
      "Se borrará el documento",
      ()=> {
        this.servicioFirebase.eliminarDocumento (this.coleccion, this.doc.id )
        .then(res => {
          //this.consultar();
          this.showPopup("Success", "Document update.") 
        }).catch(err =>
          this.showPopup("Error", "Document update.")
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
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            funcion();
            //console.log('Ok clicked');
          }
        }
      ]
    });
    alert.present();
  }

}

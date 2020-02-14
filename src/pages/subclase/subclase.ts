import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { ServicioFirebase } from '../../servicios/firebase.servicio';

@Component({
  selector: 'page-subclase',
  templateUrl: 'subclase.html'
})
export class SubClasePage {

  padre="clases";
  coleccion="clases";
  itemPadre={"id":""};
  doc={id:''};
  isUpdate=false;
  createSuccess = false;

  constructor(
    private servicioFirebase: ServicioFirebase,
    private nav: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController
    ) {
      //
      if (navParams.get('item')) {
        this.isUpdate = true;
        this.itemPadre = this.servicioFirebase.modelo[this.padre][navParams.get('idx')];
        this.doc = navParams.get('item');
      }    
      console.log("Constructor",this.doc, this.itemPadre);
      //
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Page');
  }

  public getRef(id:String) {
    let ref:string = this.padre+"/"+id+"/"+this.coleccion;
    //console.log("Ref");
    return ref;
  }

  public register() {
    {
      this.servicioFirebase.agregarDocumento(this.getRef(this.itemPadre.id), this.doc ) 
      .then(res => {
        this.consultar();
        this.showPopup("Catalogos", "Documento creado") 
      }).catch(err =>
        this.showPopup("Catalogos", "Error en creación")
      );
      }
  }

  public editar() {
    this.servicioFirebase.editarDocumento (this.getRef(this.itemPadre.id), this.doc.id, this.doc )
    .then(res => {
      this.showPopup("Municipios", "Documento actualizado") 
    }).catch(err =>
      this.showPopup("Municipios", "Error al actualizar")
    );
  }

  public borrar() {
    this.presentConfirm(
      "Confirme Baja",
      "Se borrará el documento",
      ()=> {
        this.servicioFirebase.eliminarDocumento (this.getRef(this.itemPadre.id), this.doc.id )
        .then(res => {
          this.consultar();
          this.showPopup("Catálogos", "Documento actualizado") 
        }).catch(err =>
          this.showPopup("Catálogos", "Error al actualizar")
        );
        this.nav.pop();            
      }
    );

  }

  public consultar() {
    console.log("Consultar");
    this.servicioFirebase.consultarColeccion(this.padre).then( snap1 => 
      {
        this.servicioFirebase.modelo[this.padre].forEach((element, index) => {
          this.servicioFirebase.consultarColeccion(this.getRef(element.id)).then(snap2 =>{
            this.servicioFirebase.modelo[this.padre][index][this.coleccion]=snap2;
          });   
        });                
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
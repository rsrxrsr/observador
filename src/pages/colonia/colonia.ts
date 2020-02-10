import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { ServicioFirebase } from '../../servicios/firebase.servicio';

import { maperPage } from '../maper/maper';
import { MapaPage } from '../mapa/mapa';


@Component({
  selector: 'page-colonia',
  templateUrl: 'colonia.html'
})
export class coloniaPage {

  coleccion="regiones";
  doc={id:''};
  isUpdate=false;
  createSuccess = false;
  delta={estado:{id:''}, municipio:{id:''}};

  constructor(
    private servicioFirebase: ServicioFirebase,
    private nav: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController
    ) {
      if (navParams.get('item')) {
        this.isUpdate = true;
        this.doc = navParams.get('item');
        this.delta = navParams.get('delta');
      }    
      console.log("Constructor",this.doc, this.delta);
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Page');
    //this.consultar();
  }

  public consultar() {
    console.log("Consultar");
    let idxEdo=null, idxMun=null;
    this.servicioFirebase.modelo[this.coleccion].filter((element,index)=>{
        if (element.id==this.delta.estado.id) {
           idxEdo=index;
           return true;
        }      
    });    
    this.servicioFirebase.modelo[this.coleccion][idxEdo][this.coleccion].filter((element,index)=>{
      if (element.id==this.delta.municipio.id) {
         idxMun=index;
         return true;
      }      
    });
    console.log("Edo",idxEdo,"Mun",idxMun);    
    this.servicioFirebase.consultarColeccion(this.getRef()).then(snap=>{
      this.servicioFirebase.modelo[this.coleccion][idxEdo][this.coleccion][idxMun][this.coleccion]=snap;
    }); 
  }

  public getRef() {
    let ref:string = this.coleccion+"/"+this.delta.estado.id+"/"+this.coleccion+"/"+this.delta.municipio.id+"/"+this.coleccion;
    console.log("Ref",ref);
    return ref;
  }

  public register() {
    {
      console.log("Insert",this.getRef());
      this.servicioFirebase.agregarDocumento(this.getRef(), this.doc ) 
      .then(res => {
        this.consultar();
        this.showPopup("Colonias", "Documento creado") 
      }).catch(err =>
        this.showPopup("Colonias", "Error en creación")
      );
      }
  }

  public editar() {
    this.servicioFirebase.editarDocumento (this.getRef(), this.doc.id, this.doc )
    .then(res => {
      this.showPopup("Colonias", "Documento actualizado") 
    }).catch(err =>
      this.showPopup("Colonias", "Error al actualizar")
    );
  }

  public borrar() {
    this.presentConfirm(
      "Confirme Baja",
      "Se borrará el documento",
      ()=> {
        this.servicioFirebase.eliminarDocumento (this.getRef(), this.doc.id )
        .then(res => {
          this.consultar();
          this.showPopup("Colonias", "Documento borrado") 
        }).catch(err =>
          this.showPopup("Colonias", "Error al borrar")
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

  public demarcar() {
    this.nav.push(maperPage,{
      item  : this.doc
    });      
  }

}
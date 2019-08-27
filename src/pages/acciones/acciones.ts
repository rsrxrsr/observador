import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServicioFirebase } from '../../servicios/firebase.servicio';
import { AccionPage } from '../accion/accion';
import { CasosPage } from '../casos/casos';

@IonicPage()
@Component({
  selector: 'page-acciones',
  templateUrl: 'acciones.html',
})
export class AccionesPage {

  coleccion="acciones";
  doc:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public servicioFirebase: ServicioFirebase) {
      if (navParams.data) {
        this.doc = navParams.data;
        this.doc.idCaso=this.doc.id;    
        console.log("doc",this.doc);
      }
    };
 
    public ionViewDidLoad() {
//
      this.servicioFirebase.docById("regiones/"+this.doc.idRegion)
      .then(snapshot=>this.doc.region=snapshot.region);
      this.servicioFirebase.docById("usuarios/"+this.doc.idObservador)
        .then(snapshot=>this.doc.usuario=snapshot.usuario);
      //this.servicioFirebase.consultarColeccion(this.coleccion);
      this.servicioFirebase.findOrderCollection(this.coleccion, 'idCaso', '==', this.doc.idCaso);

/*
      .then(snapshot=>{
        snapshot.forEach(element => {
          console.log("Element", element);
          element.delta={};
          //
          this.servicioFirebase.findById("usuarios", element.usuario)
          .then(item=>{
            console.log("Item1", item);
            element.delta.usuario=item.usuario;
          });
        });
        })
        */
      }

  openPage() {
    this.navCtrl.push(CasosPage);
  }
        
  public selectRow(event, item ){
    console.log("Item",item);
    this.navCtrl.push(AccionPage,{
      item:item,
      delta:this.doc
      });
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServicioFirebase } from '../../servicios/firebase.servicio';
import { AccionPage } from '../accion/accion';

@IonicPage()
@Component({
  selector: 'page-acciones',
  templateUrl: 'acciones.html',
})
export class AccionesPage {

  coleccion="acciones";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public servicioFirebase: ServicioFirebase) {};
 
    public ionViewDidLoad() {
      this.servicioFirebase.consultarColeccion(this.coleccion)
      .then(snapshot=>{
        snapshot.forEach(element => {
          console.log("Element", element);
          element.delta={};
          this.servicioFirebase.findById("usuarios", element.usuario)
          .then(item=>{
            console.log("Item1", item);
            element.delta.nmUsuario=item.usuario;
          });
          this.servicioFirebase.findById("regiones", element.idEstado)
          .then(item=>{
            console.log("Item2", item);
            element.delta.nmRegion=item.region;
            element.delta.estado=item;
          }); 
          this.servicioFirebase.findById("regiones/"+element.idEstado+"/regiones", element.region)
          .then(item=>{
            console.log("Item3", item);
            element.delta.nmRegion=element.delta.estado.region+"/"+item.region;
            element.delta.region=item;
          });
        });
    })
  }

  public selectRow(event, item ){
    this.navCtrl.push(AccionPage,{
      item:item
      });
  }

}

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
          this.servicioFirebase.findById("usuarios", element.usuario)
          .then(item=>{
            console.log("Item", item);
            element.nmUsuario=item.usuario;
          });
          this.servicioFirebase.findById("regiones/"+"ctY2TMPCWtddTOosPw81"+"/regiones", element.region)
          .then(item=>{
            console.log("Item", item);
            element.nmRegion=item.region;
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

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ServicioFirebase } from '../../servicios/firebase.servicio';
import { ClasePage } from '../clase/clase';

@Component({
  selector: 'page-clases',
  templateUrl: 'clases.html'
})
export class ClasesPage {

  public coleccion="clases";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public servicioFirebase: ServicioFirebase) {};
 
    public ionViewDidLoad() {
//      this.servicioFirebase.consultarColeccion(this.coleccion);
      this.servicioFirebase.consultarColeccion(this.coleccion);
}

  public selectRow(event, item ){
    this.navCtrl.push(ClasePage,{
      item:item
      });
  }

}

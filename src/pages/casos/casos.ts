import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ServicioDb } from '../../servicios/db.servicio';
//import { CasoPage } from '../caso/caso';

@Component({
  selector: 'page-casos',
  templateUrl: 'casos.html'
})
export class CasosPage {

  public coleccion="casos";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public servicioDb: ServicioDb) {};
 
    public ionViewDidLoad() {
      this.servicioDb.getColeccion(this.coleccion);
  }

  public selectRow(event, item ){
  //  this.navCtrl.push(ClasePage,{
  //    item:item
  //    });
  }

}

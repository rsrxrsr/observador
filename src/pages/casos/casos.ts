import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

//import { ServicioDb } from '../../servicios/db.servicio';
import { ServicioFirebase } from '../../servicios/firebase.servicio';
//import { CasoPage } from '../caso/caso';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-casos',
  templateUrl: 'casos.html'
})
export class CasosPage {

  public coleccion="caso";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public servicioFirebase: ServicioFirebase
    //public servicioDb: ServicioDb
    ) {};
 
    public ionViewDidLoad() {
      //this.servicioDb.getColeccion(this.coleccion);
      this.servicioFirebase.consultarColeccion(this.coleccion);
      //this.servicioFirebase.getOrderCollection(this.coleccion);

  }

  public selectRow(event, item ){
    this.navCtrl.push(TabsPage,{
      item:item
      });
  }

}

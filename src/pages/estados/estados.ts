import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ServicioFirebase } from '../../servicios/firebase.servicio';
import { EstadoPage } from '../estado/estado';

@Component({
  selector: 'page-estados',
  templateUrl: 'estados.html'
})
export class EstadosPage {

  public coleccion="estados";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public servicioFirebase: ServicioFirebase) {};
 
    public ionViewDidLoad() {
      this.servicioFirebase.consultarColeccion(this.coleccion);
  }

  public selectRow(event, item ){
    this.navCtrl.push(EstadoPage,{
      item:item
      });
  }

}

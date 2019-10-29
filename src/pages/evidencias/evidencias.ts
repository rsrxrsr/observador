import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServicioFirebase } from '../../servicios/firebase.servicio';

import { CasosPage } from '../casos/casos';
import { evidenciaPage } from '../evidencia/evidencia';

@IonicPage()
@Component({
  selector: 'page-evidencias',
  templateUrl: 'evidencias.html',
})
export class evidenciasPage {

  coleccion="caso/";
  item:any;

  constructor(
    public app:App,
    public navCtrl: NavController,
    public navParams: NavParams,
    public servicioFirebase: ServicioFirebase) {};
 
    public ionViewDidLoad() {
      this.item = this.navParams.data;
      this.coleccion+=this.item.id+"/evidencias";
      this.servicioFirebase.consultarColeccion(this.coleccion);
      console.log(this.coleccion);
}

  public selectRow(event, item ){
    this.navCtrl.push(evidenciaPage,{
      item:item
      });
  }

  closePage(){
    this.app.getRootNav().setRoot(CasosPage);
  }

}

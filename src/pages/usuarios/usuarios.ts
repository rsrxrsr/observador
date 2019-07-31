import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServicioFirebase } from '../../servicios/firebase.servicio';
import { UsuarioPage } from '../usuario/usuario';

@IonicPage()
@Component({
  selector: 'page-usuarios',
  templateUrl: 'usuarios.html',
})
export class UsuariosPage {

  coleccion="usuarios";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public servicioFirebase: ServicioFirebase) {};
 
    public ionViewDidLoad() {
      this.servicioFirebase.consultarColeccion(this.coleccion);
  }

  public selectRow(event, item ){
    this.navCtrl.push(UsuarioPage,{
      item:item
      });
  }

}

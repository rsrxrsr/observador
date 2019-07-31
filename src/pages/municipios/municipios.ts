import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ServicioFirebase } from '../../servicios/firebase.servicio';

import { MunicipioPage } from '../municipio/municipio';

@Component({
  selector: 'page-municipios',
  templateUrl: 'municipios.html'
})
export class MunicipiosPage {

  public padre="estados";
  public coleccion="municipios";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public servicioFirebase: ServicioFirebase) {};
 
  public ionViewDidLoad() {
    console.log('ionViewDidLoad Page');
    this.consultar();
  }

  public consultar() {
    console.log('Consultar');
    this.servicioFirebase.consultarColeccion(this.padre).then( snap1 => 
      {
        this.servicioFirebase.modelo[this.padre].forEach((element, index) => {
          this.servicioFirebase.consultarColeccion(this.getRef(element.id)).then(snap2 =>{
            this.servicioFirebase.modelo[this.padre][index][this.coleccion]=snap2;
          });   
        });                
      }
    );
  }

  public getRef(id:String) {
    let ref:string = this.padre+"/"+id+"/"+this.coleccion;
    //console.log("Ref");
    return ref;
  }

  public selectRow(event, item, idx ){
    console.log("SelectRow",item);
    this.navCtrl.push(MunicipioPage,{
      item  : item,
      idx    : idx
      });
  }

}

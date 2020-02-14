import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ServicioFirebase } from '../../servicios/firebase.servicio';

import { SubClasePage } from '../subclase/subclase';

@Component({
  selector: 'page-subclases',
  templateUrl: 'subclases.html'
})
export class SubClasesPage {

  public padre="clases";
  public coleccion="clases";

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
    console.log("SelectRow",item, idx);
    this.navCtrl.push(SubClasePage,{
      item  : item,
      idx    : idx
      });
  }

}

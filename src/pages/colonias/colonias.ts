import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ServicioFirebase } from '../../servicios/firebase.servicio';

import { coloniaPage } from '../colonia/colonia';

@Component({
  selector: 'page-colonias',
  templateUrl: 'colonias.html'
})
export class coloniasPage {

  public coleccion="regiones";
  delta={estado:{id:''}, municipio:{id:''},idxEdo:0,idxMun:0};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public servicioFirebase: ServicioFirebase) {};
 
  public ionViewDidLoad() {
    console.log('ionViewDidLoad Page');
    this.consultar(this.coleccion);
  }

  public consultar(coleccion) {
    console.log('Consultar');
  //this.servicioFirebase.consultarColecciones(coleccion);
  //
    this.servicioFirebase.consultarColeccion(coleccion).then( snap1 => {
        snap1.forEach((element, index) => {
          let ref:string = this.coleccion+"/"+element.id+"/"+this.coleccion;
          this.servicioFirebase.consultarColeccion(ref).then(snap2 =>{
            this.servicioFirebase.modelo[coleccion][index][coleccion]=snap2;
  //
            snap2.forEach((element2, index2) => {
              let ref2=ref+"/"+element2.id+"/"+this.coleccion;
              this.servicioFirebase.consultarColeccion(ref2).then(snap3 =>{
                this.servicioFirebase.modelo[coleccion][index][coleccion][index2][coleccion]=snap3;
              });
            });
  //
          });   
        });                
    });
  //
  }

  public getRef(id:String) {
    let ref:string = this.coleccion+"/"+id+"/"+this.coleccion;
    //console.log("Ref");
    return ref;
  }

  public setIdxEdo(idxEdo) {
    this.delta.idxEdo=idxEdo;
    console.log("idx",this.delta.idxEdo);
  }
  public setIdxMun(idxMun) {
    this.delta.idxMun=idxMun;
    console.log("idx",this.delta.idxMun);
  }

  public selectRow(event, item){
    console.log("SelectRow",item,this.delta);
    this.navCtrl.push(coloniaPage,{
      item  : item,
      delta : this.delta
      });
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServicioFirebase } from '../../servicios/firebase.servicio';
import { UsuarioPage } from '../usuario/usuario';
import { ConditionalExpr } from '@angular/compiler';

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
    public servicioFirebase: ServicioFirebase) { };
 
  public ionViewDidLoad() {
    this.servicioFirebase.consultarColeccion(this.coleccion);
    this.getRegiones("regiones");
  }

  public selectRow(event, item ){
    this.navCtrl.push(UsuarioPage,{
      item:item
      });
  }

  public getRegion(idRegion){
    let coleccion="regiones";
    if (!idRegion) return coleccion;
    let idx = idRegion.split("/");
    let nmRegion;
    try {
      nmRegion = this.servicioFirebase.model[coleccion][idx[1]].region + "/"
               + this.servicioFirebase.model[coleccion][idx[1]][coleccion][idx[3]].region + "/"
               + this.servicioFirebase.model[coleccion][idx[1]][coleccion][idx[3]][coleccion][idx[5]].region + "/"
    } catch (e) {
      nmRegion="Region";
      //console.log("error", e)
    }
    return nmRegion;
  }

  public getRegiones(coleccion) {
    console.log('getRegiones');
    this.servicioFirebase.getColeccion(coleccion)
    .then(snap1=>{
      for(let item in snap1) { 
        let ref:string = coleccion+"/"+item+"/"+coleccion;
        this.servicioFirebase.getColeccion(ref)
        .then(snap2=>{
          if (!snap2) return;
          this.servicioFirebase.model[coleccion][item][coleccion]=snap2;
          for(let item2 in snap2) {
            let ref2:string = coleccion+"/"+item+"/"+coleccion+"/"+item2+"/"+coleccion;
            this.servicioFirebase.getColeccion(ref2)
            .then(snap3=>{
              if (!snap3) return;
              this.servicioFirebase.model[coleccion][item][coleccion][item2][coleccion]=snap3;
            })}
        });      
      };
    });
  }

}

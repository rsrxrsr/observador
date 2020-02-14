import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MenuController } from 'ionic-angular';

import { ServicioFirebase } from '../../servicios/firebase.servicio';
import { EncuestaPage } from '../encuesta/encuesta';
import { PreguntasPage } from '../preguntas/preguntas';

@Component({
  selector: 'page-encuestas',
  templateUrl: 'encuestas.html'
})
export class EncuestasPage {

  public nmColeccion="encuestas";
  coleccion:string;
  rollPage:string;
  titulo:string;
  ref:string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public servicioFirebase: ServicioFirebase,
    public menuCtrl: MenuController) {
      menuCtrl.enable(true, 'menuEncuestas');
      this.rollPage=navParams.get('rollPage');
      this.coleccion =  (navParams.get('ref')) ? navParams.get('ref')+"/"+this.nmColeccion : this.nmColeccion;
      switch(this.rollPage) {
        case this.nmColeccion:
          this.titulo="Encuestas";
          break;
        case "preguntas":
          this.titulo="Preguntas: seleccione encuesta...";
          break;
        case "opciones":
          this.titulo="Opciones: seleccione encuesta...";
          break;
        default:
          this.titulo="Encuestas?: seleccione encuesta...";
        }
    this.servicioFirebase.modelo[this.coleccion]=[]; 
    console.log(this.nmColeccion, this.rollPage, this.coleccion);
    };
 
  public ionViewDidLoad() {
    this.servicioFirebase.consultarColeccion(this.coleccion);
  }

  public selectRow(event, item ) {
    let ref:string=this.coleccion;
    if (item) {
      ref=this.coleccion+"/"+item.id;
      //item.item=this.item;
    } else {
      item={id:''}; //,item:this.item};
    }

    switch(this.rollPage) {
      case this.nmColeccion:
          this.navCtrl.push(EncuestaPage,{rollPage:this.rollPage, ref:this.coleccion, item:item});
          break;
      default:
        this.navCtrl.push(PreguntasPage,{rollPage:this.rollPage, ref:ref, item:item});
    }
  }
 
}

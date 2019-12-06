import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ServicioFirebase } from '../../servicios/firebase.servicio';

import { PreguntaPage } from '../pregunta/pregunta';
import { OpcionesPage } from '../opciones/opciones';

@Component({
  selector: 'page-preguntas',
  templateUrl: 'preguntas.html'
})
export class PreguntasPage {

  public nmColeccion="preguntas";
  coleccion:string;
  rollPage:string;
  titulo:string;
  ref:string;
  item:{};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public servicioFirebase: ServicioFirebase) {
      this.rollPage=navParams.get('rollPage');
      this.coleccion =  (navParams.get('ref')) ? navParams.get('ref')+"/"+this.nmColeccion : this.nmColeccion;
      this.item = navParams.get('item');
      switch(this.rollPage) {
        case this.nmColeccion:
          this.titulo="Preguntas";
          break;
        case "opciones":
          this.titulo="Opciones: seleccione pregunta...";
          break;
        default:
          this.titulo="Preguntas?: seleccione opción...";
        } 
    console.log(this.nmColeccion, this.rollPage, this.coleccion);
    };
 
    public ionViewDidLoad() {
      this.servicioFirebase.consultarColeccion(this.coleccion);
  }

  public selectRow(event, item ){
    let ref:string=this.coleccion;
    if (item) {
      ref=this.coleccion+"/"+item.id;
      item.item=this.item;
    } else {
      item={id:'',item:this.item};
    }
    switch(this.rollPage) {
      case this.nmColeccion:
          this.navCtrl.push(PreguntaPage,{rollPage:this.rollPage, ref:this.coleccion, item:item});
          break;
      default:
        this.navCtrl.push(OpcionesPage,{rollPage:this.rollPage, ref:ref, item:item});
    }
  }

}

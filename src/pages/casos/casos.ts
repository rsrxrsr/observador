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
  public items=[];
  public swFind=false;
  public toggle=[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public servicioFirebase: ServicioFirebase
    //public servicioDb: ServicioDb
    ) {};
 
    public ionViewDidLoad() {
      //this.servicioDb.getColeccion(this.coleccion);
      //this.servicioFirebase.consultarColeccion(this.coleccion)
      this.servicioFirebase. getColeccion("usuarios")
      .then(snap=>this.servicioFirebase. getColeccion("clases"))
      .then(snap=>this.servicioFirebase. findOrderCaso(this.coleccion))
      .then(snap=>this.items=snap)
      .catch(error=>console.log("error en lectura"))
  }

  public selectRow(event, item ){
    this.navCtrl.push(TabsPage,{
      item:item
      });
  }

  getCategoria(ref) {
    if (!ref || ref.indexOf("/")<0) return;
    let idx = ref.split("/")
    return this.servicioFirebase.model["clases"][idx[1]]["clase"]
  }

  public setFilter(searchData, data){
    this.swFind=true;
    this.items = data.filter((item) => {
      let searchText=item.titulo+item.idClassification
                    + this.servicioFirebase.model["usuarios"][item.idObservador]["region"] 
                    + this.servicioFirebase.model["usuarios"][item.idObservador]["usuario"]
      return searchText.toLowerCase().indexOf(searchData.toLowerCase())>-1;
    });
    this.swFind=false;
  }

  public setSort(item) {
    console.log(item);
    if (!this.toggle[item]) {
      this.toggle[item]=-1;
    } 
    this.toggle[item]=this.toggle[item]*-1;
    let _this=this;
    if (item=="region" || item=="usuario") {      
      this.items.sort(
        function(a, b){
          if (_this.servicioFirebase.model["usuarios"][a.idObservador][item] > _this.servicioFirebase.model["usuarios"][b.idObservador][item]) {
            return 1*_this.toggle[item];
          }
          if (_this.servicioFirebase.model["usuarios"][a.idObservador][item] < _this.servicioFirebase.model["usuarios"][b.idObservador][item]) {
            return -1*_this.toggle[item];
          }
          // a must be equal to b
          return 0;
      })
    } else {
      this.items.sort(
        function(a, b){
          if (a[item] > b[item]) {
            return 1*_this.toggle[item];
          }
          if (a[item] < b[item]) {
            return -1*_this.toggle[item];
          }
          // a must be equal to b
          return 0;
      })
    }
  }  
}

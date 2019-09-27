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
      this.servicioFirebase.consultarColeccion(this.coleccion).then(snap=>{
        this.items=snap;
      })
      //this.servicioFirebase.getOrderCollection(this.coleccion);
  }

  public selectRow(event, item ){
    this.navCtrl.push(TabsPage,{
      item:item
      });
  }

  public setFilter(searchData, data){
    this.swFind=true;
    this.items = data.filter((item) => {
      let searchText=item.titulo+item.idClassification+item.municipio;
      return searchText.toLowerCase().indexOf(searchData)>-1;
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

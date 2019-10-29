import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServicioFirebase } from '../../servicios/firebase.servicio';
import { AccionPage } from '../accion/accion';
import { CasosPage } from '../casos/casos';

@IonicPage()
@Component({
  selector: 'page-acciones',
  templateUrl: 'acciones.html',
})
export class AccionesPage {

  coleccion="acciones";
  regiones="regiones";
  doc:any;
  delta={estado:{},municipio:{},colonia:{}};
  isUpdate=false;

  constructor(
    public app:App,
    public navCtrl: NavController,
    public navParams: NavParams,
    public servicioFirebase: ServicioFirebase) {
      if (navParams.data.id) {
        this.doc = navParams.data;
        this.doc.idCaso=this.doc.id;
        this.isUpdate=true;    
        console.log("doc",this.doc);
      } else {
        this.doc = {idCaso:"",idObservador:""};
      }
    };
 
    public ionViewDidLoad() {
//
//      this.servicioFirebase.docById("regiones/"+this.doc.idRegion)
//      .then(snapshot=>this.doc.region=snapshot.region);
      this.getRegiones("regiones");
      if (this.isUpdate) {
        this.servicioFirebase.docById("usuarios/"+this.doc.idObservador)
        .then(snapshot=>this.doc.usuario=snapshot.usuario);
        this.servicioFirebase.findOrderCollection(this.coleccion, 'idCaso', '==', this.doc.idCaso);
      } else {
        this.servicioFirebase.consultarColeccion(this.coleccion);
      }
/*
      .then(snapshot=>{
        snapshot.forEach(element => {
          console.log("Element", element);
          element.delta={};
          //
          this.servicioFirebase.findById("usuarios", element.usuario)
          .then(item=>{
            console.log("Item1", item);
            element.delta.usuario=item.usuario;
          });
        });
        })
        */
      }

  closePage(){
    this.app.getRootNav().setRoot(CasosPage);
  }
            
  public selectRow(event, item ){
    console.log("Item",item);
    if (item){
      this.setRegiones(item.idRegion);
      this.doc["idRegion"]=item.idRegion;
      this.doc["region"]=item.region;
    } else 
    if (!this.doc.region) {
      alert("Indique Region");
      return;
    } 

    this.navCtrl.push(AccionPage,{
      item:item,
      delta:this.doc
    });
  }

  getRegiones(coleccion) {
    console.log('getRegiones');
  //this.servicioFirebase.consultarColecciones(coleccion);
  //
    this.servicioFirebase.consultarColeccion(coleccion).then( snap1 => {
        snap1.forEach((element, index) => {
          let ref:string = coleccion+"/"+element.id+"/"+coleccion;
          this.servicioFirebase.consultarColeccion(ref).then(snap2 =>{
            this.servicioFirebase.modelo[coleccion][index][coleccion]=snap2;
  //
            snap2.forEach((element2, index2) => {
              let ref2=ref+"/"+element2.id+"/"+coleccion;
              this.servicioFirebase.consultarColeccion(ref2).then(snap3 =>{
                this.servicioFirebase.modelo[coleccion][index][coleccion][index2][coleccion]=snap3;
                if (this.doc["idRegion"] && this.doc["idRegion"].indexOf(element2.id) >=0 && this.isUpdate) this.setRegiones(this.doc["idRegion"]);                  
              });
            });
  //
          });   
        });
    });
  //
  }

  setRegiones(idRegion) {
    console.log("setEdo", idRegion);
    let coleccion="regiones";
    if (!idRegion) return;
    let idx = idRegion.split("/");
    let idxEdo=null, idxMun=null;
    this.servicioFirebase.modelo[coleccion].filter((element,index)=>{
        if (element.id==idx[1]) {
          idxEdo=index;
          this.delta.estado=element;
          return true;
        }      
    });
    console.log("Estado",this.delta.estado);    
    console.log("setMun", idxEdo);
    this.delta.municipio={};
    this.servicioFirebase.modelo[coleccion][idxEdo][coleccion].filter((element,index)=>{
      if (idx.length>3 && element.id==idx[3]) {
         idxMun=index;
         this.delta.municipio=element;
         return true;
      }      
    });
    console.log("Municipio",this.delta.municipio);    
    console.log("setCol", idxMun);
    this.delta.colonia={};
    if (idx.length>5) {
      this.servicioFirebase.modelo[coleccion][idxEdo][coleccion][idxMun][coleccion].filter((element,index)=>{
        if (idx.length>5 && element.id==idx[5]) {
           this.delta.colonia=element;
           return true;
        }      
      });  
    } 
    this.setIdRegion(this.regiones);
    console.log("Colonia",this.delta.colonia);
    console.log("Regiones",this.servicioFirebase.modelo[coleccion]);
  }

  setIdRegion(coleccion) {
    console.log("setIdRegion");
    let ref:string, region:string;
    if (this.delta.estado["id"]) {
      ref = coleccion+"/"+this.delta.estado["id"];
      region = this.delta.estado["region"];
    }
    if (coleccion!="estado") {  
      if (this.delta.municipio["id"]) {
        ref +="/"+coleccion+"/"+this.delta.municipio["id"];  
        region += "/"+this.delta.municipio["region"];
      }
      if (coleccion!="municipio") {  
        if (this.delta.colonia["id"]){
          ref +="/"+coleccion+"/"+this.delta.colonia["id"];
          region += "/"+this.delta.colonia["region"];
        }
      }
    }
    this.doc["idRegion"]=ref;
    this.doc["region"]=region;
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ServicioFirebase } from '../../servicios/firebase.servicio';

@IonicPage()
@Component({
  selector: 'page-accion',
  templateUrl: 'accion.html',
})
export class AccionPage {

  coleccion="acciones";
  isUpdate=false; 
  createSuccess = false;
  doc = {id:"",delta:{nmRegion:"", estado:{id:"",region:"",regiones:[]}}};
  file:any;
  work = {nmRegion:"", nmUsuario:""};

  constructor(
    private servicioFirebase: ServicioFirebase,
    private nav: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController
    ) {
      if (navParams.get('item')) {
        this.isUpdate = true;
        this.doc = navParams.get('item');        
      }    
      console.info("accion",this.doc);
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad accionPage');
    this.servicioFirebase.consultarColeccion("usuarios");
    this.servicioFirebase.consultarColeccion("regiones")
    .then(snapshot=>{
      snapshot.forEach(item => {
        this.servicioFirebase.consultarColeccion("regiones/"+item.id+"/regiones")
        .then(snapshot=>{
          item.regiones=snapshot;          
          if (!this.isUpdate) {
            this.doc.delta['estado']=item;
            this.doc.delta['nmRegion']=item.region+"/"+snapshot.region;
            this.doc['idEstado']=item.id;
            this.doc['region']=snapshot.id;
          }
          if (item.id===this.doc.delta['estado'].id) {
            this.doc.delta['estado'].regiones=item.regiones;
          }
          console.log("Doc", this.doc);
        }); 
      });
      console.log("Estado",this.doc['delta']);
      console.log('ionViewDidLoad Regiones', this.servicioFirebase.modelo['regiones']);
    });
  } 
  
  compareWithFn = (o1, o2) => {
    //console.log("Compare", o1, "o2=", o2, ".End");
    //console.log("Compare", o1 && o2, o1.id === o2.id, o1 === o2, o1.id,o2.id);
    //return o1 && o2 ? o1.id === o2.id : o1 === o2;
    return o1.id === o2.id;
  };

  onChangeEstado(valor) {
    this.doc['idEstado']=this.doc['delta'].estado.id;
    this.work.nmRegion=this.doc['delta'].estado.region;
    console.log("onChange1", this.work.nmRegion);
  }

  onChangeRegion(valor){
    this.doc['region']=this.doc['delta']['region'].id;
    this.work.nmRegion+="/"+this.doc['delta']['region'].region;
    console.log("onChange2", this.work.nmRegion);
  }

  onChangeUsuario(id) {
    console.log("onChange3", id);
    this.work.nmUsuario=this.doc['usuario'];
  }

  public register() {
    this.servicioFirebase.agregarDocumento(this.coleccion, this.doc );
    this.doc.delta.nmRegion=this.work.nmRegion; 
    this.showPopup("Success", "Document created.");            
  }

  public editar() {
    this.servicioFirebase.editarDocumento (this.coleccion, this.doc.id, this.doc );
    console.log("Region",this.work.nmRegion);
    this.doc.delta.nmRegion=this.work.nmRegion; 
    this.showPopup("Success", "Document updated.");          
  }

  public borrar() {
    this.servicioFirebase.eliminarDocumento (this.coleccion, this.doc.id );  
    this.showPopup("Success", "Document delete."); 
  }

  setFile(event) {
    this.file = event.target.files[0];
    console.log("File:",this.file);
  }

  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            if (this.createSuccess) {
              this.nav.popToRoot();
            }
          }
        }
      ]
    });
    alert.present();
  }

}
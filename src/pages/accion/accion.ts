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
  doc = { id: ""};
  file:any;
  municipios:[];

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
    this.servicioFirebase.consultarColeccion("regiones");
/*
    .then(snapshot=>{
      this.servicioFirebase.modelo["regiones"].forEach(element => {
        let coleccion="regiones/"+element.id+"/regiones";
        this.servicioFirebase.consultarColeccion(coleccion)
        .then(snapshot=>{
          this.servicioFirebase.modelo["regiones"][element.id].regiones=snapshot;
        });          
      });
      console.log("snap",this.servicioFirebase.modelo["regiones"]);
    })
*/      
  }

  onChange(id) {
    console.log("onChange", id);
    this.servicioFirebase.consultarColeccion("regiones/"+id+"/regiones")
    .then(snapshot=>this.municipios=snapshot);
  }

  public register() {
    //Validar
    //if (this.doc.pass != this.forma.confirmation_password) {
    //this.showPopup("Error", 'The password confirmation does not match.');
    //}

    this.servicioFirebase.agregarDocumento(this.coleccion, this.doc ); 
    this.showPopup("Success", "Document created.");          
  
  }

  public editar() {
    this.servicioFirebase.editarDocumento (this.coleccion, this.doc.id, this.doc );
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
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
  doc = {id:""};
  delta:any; 

  constructor(
    private servicioFirebase: ServicioFirebase,
    private nav: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController
    ) {
      if (navParams.get('item')) {
        this.isUpdate = true;
        this.doc=navParams.get('item'); 
      } else {
        this.doc['estatus']="Activo";
      }
      this.delta = navParams.get('delta');
      this.doc['idCaso']=this.delta.idCaso;
      this.doc['idRegion']=this.delta.idRegion;
      this.doc['idObservador']=this.delta.idObservador;
      console.info("doc",this.doc, "delta", this.delta);
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad accionPage');
    this.servicioFirebase.consultarColeccion("encuestas");
   } 
 
  public register() {
    this.servicioFirebase.agregarDocumento(this.coleccion, this.doc );
    if (this.doc['tipo']=="Encuesta") {
      let encuesta={idRegion:this.doc['idRegion'],idCaso:this.doc['idCaso'],fhInicio:this.doc['fhAlta'],fhFin:this.doc['fhFinPlan']};       
      this.servicioFirebase.agregarDocumento("encuestas/"+this.delta.idEncuesta+"/instancias", encuesta );  
    }
    this.showPopup("Alta", "Documento creado");            
  }

  public editar() {
    this.servicioFirebase.editarDocumento (this.coleccion, this.doc.id, this.doc );
    this.showPopup("Cambio", "Documento actualizado");          
  }

  public borrar() {
    this.servicioFirebase.eliminarDocumento (this.coleccion, this.doc.id );  
    this.showPopup("Baja", "Documento borrado"); 
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
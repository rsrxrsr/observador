import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { ServicioFirebase } from '../../servicios/firebase.servicio';

@Component({
  selector: 'page-encuesta',
  templateUrl: 'encuesta.html'
})
export class EncuestaPage {

  coleccion="encuestas";
  isUpdate=false; 
  createSuccess = false;
  doc={id:''};

  constructor(
    private servicioFirebase: ServicioFirebase,
    private nav: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController
    ) {
      this.doc = navParams.get('item');
      this.isUpdate = this.doc.id!='';
      console.log("encuesta",this.doc);
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Page');
  }

  public register() {
    {
      this.servicioFirebase.agregarDocumento(this.coleccion, this.doc ) 
      .then(res => {
        this.registrarEncuesta(res["id"]);
        this.showPopup("Encuestas", "Documento creado") 
      }).catch(err =>
        this.showPopup("Encuestas", "Error en creación")
      );
      }
  }

  public editar() {
    this.servicioFirebase.editarDocumento (this.coleccion, this.doc.id, this.doc )
    .then(res => {
      this.registrarEncuesta(this.doc.id);
      this.showPopup("Encuestas", "Documento actualizado") 
    }).catch(err =>
      this.showPopup("Encuestas", "Error al actualizar")
    );
  }

  public borrar() {
    this.presentConfirm(
      "Confirme Baja",
      "Se borrará el documento",
      ()=> {
        this.servicioFirebase.eliminarDocumento (this.coleccion, this.doc.id )
        .then(res => {
          this.showPopup("Encuestas", "Documento borrado") 
        }).catch(err =>
          this.showPopup("Encuestas", "Error al borrar")
        );
        this.nav.pop();            
      }
    );

  }

  public registrarEncuesta(id:String) {    
    //if (!this.isUpdate) {
      this.doc["idInstancia"]=this.servicioFirebase.getId();
    //}
    console.log("Instancia",id,this.doc["idInstancia"]);
    let encuesta={idRegion:"",idCaso:"",fhInicio:new Date().toISOString(),fhFin:new Date().toISOString()};
    this.servicioFirebase.upsertDocument("encuestas/"+id+"/instancias",this.doc["idInstancia"],encuesta );  
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

  presentConfirm(title:string, message:string, funcion:any) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
//            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            funcion();
//            console.log('Buy clicked');
          }
        }
      ]
    });
    alert.present();
  }

  /*

  public consultar() {
    console.log("Consultar");
    this.servicioFirebase.consultarColeccion(this.padre).then( snap1 => 
      {
        this.servicioFirebase.modelo[this.padre].forEach((element, index) => {
          this.servicioFirebase.consultarColeccion(this.getRef(element.id)).then(snap2 =>{
            this.servicioFirebase.modelo[this.padre][index][this.coleccion]=snap2;
          });   
        });                
      }
    );
  }

  public register() {
    {
      this.servicioFirebase.agregarDocumento(this.coleccion, this.doc ); 
      this.showPopup("Success", "Document created.");
    }
  }

  public editar() {
    this.servicioFirebase.editarDocumento (this.coleccion, this.doc.id, this.doc );
    this.showPopup("Success", "Document update."); 
  }

  public borrar() {
    this.servicioFirebase.eliminarDocumento (this.coleccion, this.doc.id );  
    this.showPopup("Success", "Document delete."); 
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
*/
}
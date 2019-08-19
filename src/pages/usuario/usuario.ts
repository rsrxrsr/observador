import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ServicioFirebase } from '../../servicios/firebase.servicio';

@IonicPage()
@Component({
  selector: 'page-usuario',
  templateUrl: 'usuario.html',
})
export class UsuarioPage {

  coleccion="usuarios";
  isUpdate=false; 
  createSuccess = false;
  forma = {id:'', confirmation_password: '' };
  doc = { id: "",pass:""};
  file:any;

  constructor(
    private servicioFirebase: ServicioFirebase,
    private nav: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController
    ) {
      if (navParams.get('item')) {
        this.isUpdate = true;
        this.doc = navParams.get('item');
        this.forma.confirmation_password=this.doc.pass;
      }    
      console.info("usuario",this.doc);
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad usuarioPage');
  }

  public register() {
    //Validar
    if (this.doc.pass != this.forma.confirmation_password) {
      this.showPopup("Error", 'The password confirmation does not match.');
    } else 
    if (this.file) {
        this.servicioFirebase.fileUpload(this.file).then(fileInfo=>{
        this.doc["foto"]=fileInfo.downloadUrl;
        this.servicioFirebase.agregarDocumento("usuarios", this.doc ); 
        this.showPopup("Success", "Document created.");          
      })
    } else {
      this.servicioFirebase.agregarDocumento("usuarios", this.doc ); 
      this.showPopup("Success", "Document created.");          
    }
  }

  public editar() {
    if (this.file) {
      this.servicioFirebase.fileUpload(this.file).then(fileInfo=>{
      this.doc["foto"]=fileInfo.downloadUrl;
      this.servicioFirebase.editarDocumento (this.coleccion, this.doc.id, this.doc );
      this.showPopup("Success", "Document updated.");          
    })} else {
      this.servicioFirebase.editarDocumento (this.coleccion, this.doc.id, this.doc );
      this.showPopup("Success", "Document updated.");          
    }
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
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
  doc = { id: "",password:""};

  constructor(
    private servicioFirebase: ServicioFirebase,
    private nav: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController
    ) {
      if (navParams.get('item')) {
        this.isUpdate = true;
        this.doc = navParams.get('item');
        this.forma.confirmation_password=this.doc.password;
      }    
      console.info("usuario",this.doc);
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad usuarioPage');
  }

  public register() {
    //Validar
    if (this.doc.password != this.forma.confirmation_password) {
      this.showPopup("Error", 'The password confirmation does not match.');
    } else {

      this.servicioFirebase.agregarDocumento("usuarios", this.doc ); 
      this.showPopup("Success", "Document created.");

      /*
      this.servicioFirebase.register(this.registerCredentials).subscribe(success => {
        if (success) {
          this.createSuccess = true;
          this.showPopup("Success", "Account created.");
        } else {
          this.showPopup("Error", "Problem creating account.");
        }
      },
        error => {
          this.showPopup("Error", error);
        });
      */  
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

}
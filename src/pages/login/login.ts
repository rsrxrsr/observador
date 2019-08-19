import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController } from 'ionic-angular';
import { ServicioFirebase } from '../../servicios/firebase.servicio';

import { CasosPage } from '../casos/casos';

//import { HomePage } from '../home/home';
//import { TabsPage } from '../tabs/tabs';
//import { menuCatalogos } from '../menuCatalogos/menuCatalogos';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  isUpdate=false; 
  createSuccess = false;
  forma = {id:'' };
  usuario = { correo: '', pass: ''};

  constructor(
    private servicioFirebase: ServicioFirebase,
    private navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    public menuCtrl: MenuController 
    ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  public login() {
    //this.navCtrl.push(TabsPage);  //remove for prod
    var usuarios:any =[];
    console.info('FrmUsuarios',this.usuario.correo);
    this.servicioFirebase.findColeccion("usuarios",'correo','==',this.usuario.correo).then(
      resp =>{usuarios = resp;        
        if (usuarios.length==1 && this.usuario.pass === usuarios[0].pass) {
          //this.showPopup("Success", "Account created.");
          this.menuCtrl.enable(true, 'menuMain');
          this.navCtrl. setRoot(CasosPage);
        } else {
          this.showPopup("Error", 'The password confirmation does not match.');
        }
      }
    );     
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
              this.navCtrl.popToRoot();
            }
          }
        }
      ]
    });
    alert.present();
  }

}


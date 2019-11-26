import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController } from 'ionic-angular';
import { ServicioFirebase } from '../../servicios/firebase.servicio';

import { CasosPage } from '../casos/casos';
import { HomePage } from '../home/home';

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
  usuario = { correo: '', pass: '', estatus:''};

  constructor(
    private servicioFirebase: ServicioFirebase,
    private navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    public menuCtrl: MenuController 
    ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
    //this.servicioFirebase.logoutUser();
  }

  public login() {
    //this.navCtrl.push(TabsPage);  //remove for prod
    this.servicioFirebase.loginUser(this.usuario.correo,this.usuario.pass).then(snap=>{
      var usuarios:any =[];
      this.servicioFirebase.findColeccion("usuarios",'correo','==',this.usuario.correo).then(
        resp =>{usuarios = resp;
          console.info('FrmUsuarios',usuarios[0], this.usuario);        
          if (usuarios.length==1 && this.usuario.pass === usuarios[0].pass && usuarios[0].estatus=="Activo") {
            //this.showPopup("Success", "Account created.");
            this.servicioFirebase.modelo["usuario"]=usuarios[0];
            console.log("Log",this.servicioFirebase.modelo["usuario"]);
            this.servicioFirebase.roles=this.servicioFirebase.modelo["usuario"]["roles"].join(",");
            this.menuCtrl.enable(true, 'menuMain');
            if (this.servicioFirebase.roles.includes("Supervisor")) {
              this.navCtrl. setRoot(CasosPage);
            } else
            if (this.servicioFirebase.roles.includes("Administrador")) {
                this.navCtrl. setRoot(HomePage);
            } else { 
              this.showPopup("Alerta", 'Acceso no autorizado');
            }
          } else {
            this.showPopup("Alerta", 'Usuario no autorizado');
          }
        }
      );
    });     
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


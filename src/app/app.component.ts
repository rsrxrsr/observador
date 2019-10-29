import { Component, ViewChild } from '@angular/core';
import { App, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { FcmService } from '../servicios/fcm.servicio';
import { ServicioFirebase } from '../servicios/firebase.servicio';

import { WelcomePage } from '../pages/welcome/welcome';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { UsuariosPage } from '../pages/usuarios/usuarios';
import { menuCatalogos } from '../pages/menuCatalogos/menuCatalogos';
import { EstadosPage } from '../pages/estados/estados';
import { MunicipiosPage } from '../pages/municipios/municipios';
import { coloniasPage } from '../pages/colonias/colonias';
import { ClasesPage } from '../pages/clases/clases';
import { menuEncuestas } from '../pages/menuEncuestas/menuEncuestas';
import { EncuestasPage } from '../pages/encuestas/encuestas';
import { PreguntasPage } from '../pages/preguntas/preguntas';
import { OpcionesPage } from '../pages/opciones/opciones';
import { cuestionarioPage } from '../pages/cuestionario/cuestionario';
import { CasosPage } from '../pages/casos/casos';
import { AccionesPage } from '../pages/acciones/acciones';

@Component({
  templateUrl: 'app.html'
})
export class ObservadorApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = LoginPage;
  pages: Array<{title: string, component: any}>;
  paginas:{};
  constructor(    
    public platform: Platform,
    private fcm: FcmService,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public app:App,
    public servicioFirebase: ServicioFirebase) {
    this.initializeApp();
  }

  initializeApp() {    
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      //this.notificationSetup();
    });
    this.paginas = {
      'WelcomePage'    : WelcomePage,
      'LoginPage'      : LoginPage,
      'HomePage'       : HomePage,
      'TabsPage'       : TabsPage,
      'UsuariosPage'   : UsuariosPage,
      'menuCatalogos'  : menuCatalogos,
      'EstadosPage'    : EstadosPage,
      'MunicipiosPage' : MunicipiosPage,
      'coloniasPage'   : coloniasPage,
      'ClasesPage'     : ClasesPage,
      'menuEncuestas'  : menuEncuestas, 
      'EncuestasPage'  : EncuestasPage,
      'PreguntasPage'  : PreguntasPage,
      'OpcionesPage'   : OpcionesPage,
      'cuestionarioPage' : cuestionarioPage,
      'CasosPage'      : CasosPage,
      'AccionesPage'   : AccionesPage,
    }
  }
  //
  private async presentToast(message) {
    alert(message);
    /*
    const toast = await this.toastController.create({
      message,
      duration: 3000
    });
    toast.present();
    */
  }

  private notificationSetup() {
    this.fcm.getToken();
    this.fcm.onNotifications().subscribe(
      (msg) => {
        if (this.platform.is('ios')) {
          this.presentToast(msg.aps.alert);
        } else {
          this.presentToast(msg.body);
        }
      });
  }
  //
 
  openPage(page:any) {
    //this.rootPage = paginas[pagina]; 
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    //this.nav.setRoot(page.component);
    this.nav. setRoot(this.paginas[page]);
  }

  openRollPage(page:any, rollPage:string) {
    //this.navCtrl.push(this.paginas[page],{rollPage : rollPage});
    this.app.getRootNav().setRoot(this.paginas[page], {rollPage:rollPage});
  }

  logout(page:any){
    //this.rootPage = WelcomePage;
    //this.nav.setRoot(this.paginas[page]);
    //this.app.getRootNav().popToRoot();
    this.nav. setRoot(this.paginas[page]); 
  }

}
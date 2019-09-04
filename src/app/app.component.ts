import { Component, ViewChild } from '@angular/core';
import { App, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

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
import { CasosPage } from '../pages/casos/casos';
import { AccionesPage } from '../pages/acciones/acciones';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  app:any;
  rootPage:any = LoginPage;
  pages: Array<{title: string, component: any}>;
  paginas:{};
  constructor(    
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    app:App) {
      this.app=app;
    //initializeApp() {
      platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        statusBar.styleDefault();
        splashScreen.hide();
      });
      this.pages = [
      { title: 'Welcome', component: WelcomePage },
      { title: 'Login', component: LoginPage },
      { title: 'Tabs', component: TabsPage },
      { title: 'Catalogos', component: menuCatalogos },
      { title: 'Estados', component: EstadosPage },
      { title: 'Municipios', component: MunicipiosPage }
      ];
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
        'CasosPage'      : CasosPage,
        'AccionesPage'   : AccionesPage,
      }
  }

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
    //this.nav.setRoot(this.paginas[page]);
    //this.rootPage = WelcomePage; 
    this.app.getRootNav().popToRoot();
  }

}
import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';

import { MenuController } from 'ionic-angular';

@Component({
  selector: 'page-menuCatalogos',
  templateUrl: 'menuCatalogos.html'
})
export class menuCatalogos {

  constructor(public navCtrl: NavController, public app: App
    , public menuCtrl: MenuController) {
        menuCtrl.enable(true, 'menuCatalogos');
        menuCtrl.enable(false, 'menuMain');
  }

logout(){
        // Remove API token 
        const root = this.app.getRootNav();
        root.popToRoot();
  }
}
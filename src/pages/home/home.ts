import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';

import { MenuController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public app: App
    , public menuCtrl: MenuController) {
      menuCtrl.enable(false, 'menuCatalogos');
      menuCtrl.enable(true, 'menuMain');
  }

logout(){
        // Remove API token 
        const root = this.app.getRootNav();
        root.popToRoot();
  }
}
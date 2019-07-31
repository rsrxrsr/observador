import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';

import { MenuController } from 'ionic-angular';

@Component({
  selector: 'page-menuEncuestas',
  templateUrl: 'menuEncuestas.html'
})
export class menuEncuestas {

  constructor(public navCtrl: NavController, public app: App
    , public menuCtrl: MenuController) {
        menuCtrl.enable(true, 'menuEncuestas');
  }

  logout(){
        // Remove API token 
        const root = this.app.getRootNav();
        root.popToRoot();
  }
}
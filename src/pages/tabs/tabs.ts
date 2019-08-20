import { Component } from '@angular/core';

import { TableroPage } from '../tablero/tablero';
import { UsuariosPage } from '../usuarios/usuarios';
import { EstadosPage } from '../estados/estados';
import { MapaPage } from '../mapa/mapa';
import { CamaraPage } from '../camara/camara';
import { CasoPage } from '../caso/caso';
import { AccionesPage } from '../acciones/acciones';
import { NavParams } from 'ionic-angular';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  public item:any;
  tab1Root = CasoPage;
  tab2Root = CamaraPage;
  tab3Root = MapaPage;
  tab4Root = AccionesPage;
 
  constructor(public navParams:NavParams) {
  }
  ngOnInit(){
    if (this.navParams.get('item')) {
      this.item = this.navParams.get('item');
    } 
    console.log("Param",this.item);   
  }
}

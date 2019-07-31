import { Component } from '@angular/core';

import { TableroPage } from '../tablero/tablero';
import { UsuariosPage } from '../usuarios/usuarios';
import { EstadosPage } from '../estados/estados';
import { MapaPage } from '../mapa/mapa';
import { CamaraPage } from '../camara/camara';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = UsuariosPage;
  tab2Root = EstadosPage;
  tab3Root = CamaraPage;
  tab4Root = MapaPage;
  tab5Root = TableroPage;
 
  constructor() {
  }
}

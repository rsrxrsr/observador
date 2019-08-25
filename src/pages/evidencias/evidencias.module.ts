import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { evidenciasPage } from './evidencias';

@NgModule({
  declarations: [
    evidenciasPage,
  ],
  imports: [
    IonicPageModule.forChild(evidenciasPage),
  ],
})
export class evidenciasPageModule {}

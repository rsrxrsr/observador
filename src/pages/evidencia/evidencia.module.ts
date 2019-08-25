import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { evidenciaPage } from './evidencia';

@NgModule({
  declarations: [
    evidenciaPage,
  ],
  imports: [
    IonicPageModule.forChild(evidenciaPage),
  ],
})
export class evidenciaPageModule {}

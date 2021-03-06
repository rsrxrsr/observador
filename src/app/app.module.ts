import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { ObservadorApp } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { Firebase } from '@ionic-native/firebase/ngx';
import { AngularFireAuthModule } from "@angular/fire/auth";

import { CONEXION_BD } from './ambiente';
import { ServicioFirebase } from '../servicios/firebase.servicio';
import { ServicioDb } from '../servicios/db.servicio';
import { FcmService } from '../servicios/fcm.servicio';
import { IonicStorageModule } from '@ionic/storage';
import { Camera } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClientModule } from '@angular/common/http';
//import { Chart } from 'chart.js';

import { LoginPageModule } from '../pages/login/login.module';
import { UsuarioPageModule } from '../pages/usuario/usuario.module';
import { UsuariosPageModule } from '../pages/usuarios/usuarios.module';
import { AccionPageModule } from '../pages/accion/accion.module';
import { AccionesPageModule } from '../pages/acciones/acciones.module';
import { WelcomePageModule } from '../pages/welcome/welcome.module';
import { evidenciasPageModule } from '../pages/evidencias/evidencias.module';
import { evidenciaPageModule } from '../pages/evidencia/evidencia.module';

//import { WelcomePage } from '../pages/welcome/welcome';
//import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
//import { UsuarioPage } from '../pages/usuario/usuario';
//mport { UsuariosPage } from '../pages/usuarios/usuarios';
import { CamaraPage } from '../pages/camara/camara';

import { menuCatalogos } from '../pages/menuCatalogos/menuCatalogos';
import { EstadoPage } from '../pages/estado/estado';
import { EstadosPage } from '../pages/estados/estados';
import { MunicipioPage } from '../pages/municipio/municipio';
import { MunicipiosPage } from '../pages/municipios/municipios';
import { coloniaPage } from '../pages/colonia/colonia';
import { coloniasPage } from '../pages/colonias/colonias';
import { ClasePage } from '../pages/clase/clase';
import { ClasesPage } from '../pages/clases/clases';
import { SubClasePage } from '../pages/subclase/subclase';
import { SubClasesPage } from '../pages/subclases/subclases';
import { menuEncuestas } from '../pages/menuEncuestas/menuEncuestas';
import { EncuestaPage } from '../pages/encuesta/encuesta';
import { EncuestasPage } from '../pages/encuestas/encuestas';
import { PreguntaPage } from '../pages/pregunta/pregunta';
import { PreguntasPage } from '../pages/preguntas/preguntas';
import { OpcionPage } from '../pages/opcion/opcion';
import { OpcionesPage } from '../pages/opciones/opciones';
import { CuestionarioPage } from '../pages/cuestionario/cuestionario';
import { CasoPage } from '../pages/caso/caso';
import { CasosPage } from '../pages/casos/casos';
import { tablePage } from '../pages/table/table';
import { TableroPage } from '../pages/tablero/tablero';
import { MapaPage } from '../pages/mapa/mapa';
import { maperPage } from '../pages/maper/maper';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
  ObservadorApp,
  //  WelcomePage,
  //  LoginPage,
    HomePage,
    TabsPage,
  //  UsuarioPage,
  //  UsuariosPage,
    CamaraPage,
    menuCatalogos,
    EstadoPage,
    EstadosPage,
    MunicipioPage,
    MunicipiosPage,
    coloniaPage,
    coloniasPage,
    ClasePage,
    ClasesPage,
    SubClasePage,
    SubClasesPage,
    menuEncuestas,
    EncuestaPage,
    EncuestasPage,
    PreguntaPage,
    PreguntasPage,
    OpcionPage,
    OpcionesPage,
    CuestionarioPage,
    CasoPage,
    CasosPage,
    TableroPage,
    tablePage,
    MapaPage,
    maperPage
  ],
  exports:[],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(ObservadorApp),
    AngularFireModule.initializeApp(CONEXION_BD.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    IonicStorageModule.forRoot(),
    LoginPageModule,
    WelcomePageModule,
    UsuarioPageModule,
    UsuariosPageModule,
    evidenciasPageModule,
    evidenciaPageModule,
    AccionPageModule,
    AccionesPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ObservadorApp,
//    WelcomePage,
//    LoginPage,
    HomePage,
    TabsPage,
//    UsuarioPage,
//    UsuariosPage,
    CamaraPage,
    menuCatalogos,
    EstadoPage,
    EstadosPage,
    MunicipioPage,
    MunicipiosPage,
    coloniaPage,
    coloniasPage,
    ClasePage,
    ClasesPage,
    SubClasePage,
    SubClasesPage,
    menuEncuestas,
    EncuestaPage,
    EncuestasPage,
    PreguntaPage,
    PreguntasPage,
    CuestionarioPage,
    OpcionPage,
    OpcionesPage,
    CasoPage,
    CasosPage,
    TableroPage,
    tablePage,
    MapaPage,
    maperPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ServicioFirebase,
    Firebase,
    FcmService,
    ServicioDb,
    Camera,
    Geolocation
  ]
})
export class AppModule {}

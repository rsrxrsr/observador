import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ServicioFirebase } from '../../servicios/firebase.servicio';
import { ServicioDb } from '../../servicios/db.servicio';

@IonicPage()
@Component({
  selector: 'page-accion',
  templateUrl: 'accion.html',
})
export class AccionPage {

  coleccion="acciones";
  regiones="regiones";
  isUpdate=false;
  fecha: any = new Date();
  fh = this.fecha.toLocaleDateString();
  isCaso=false;
  createSuccess = false;
  doc = {id:"",informe:"",fhAlta:this.fh};
  delta={estado:{id:''}, municipio:{id:''},colonia:{id:''},idCaso:"",idRegion:"",idObservador:"" };
  informe:String="";

  constructor(
    private servicioFirebase: ServicioFirebase,
    private nav: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    public servicioDb: ServicioDb
    ) {
      if (navParams.get('item')) {
        this.isUpdate = true;
        this.doc=navParams.get('item'); 
        //this.delta = navParams.get('delta');
      } else {
        this.doc.fhAlta=this.fh;
        this.doc['estatus']="Activo";
      }
      //
      if (navParams.get('delta')) {
        let artra = navParams.get('delta');
        console.log("Watch",this.doc['idRegion'],artra.idRegion);
        this.doc['idRegion'] = "regiones/mYB9TZez4ys9WGHJbHJy/regiones/LsyugJFENlqSo8ZQc2iq";
        this.doc['region'] = "CdMx/Miguel Hidalgo";    
        if (artra.idRegion) {
          //this.delta.idRegion=artra.idRegion;
          //this.doc['idRegion']=artra.idRegion;
          this.doc['idRegion'] = this.servicioFirebase.modelo["usuario"]["idRegion"];
          this.doc['region'] = this.servicioFirebase.modelo["usuario"]["region"];    
          this.delta.idRegion=this.doc['region'];
          this.isCaso=true;
        }
        this.delta.idCaso=artra.idCaso;
        this.delta.idObservador=artra.idObservador;
      }
      //
      //this.doc['idRegion']=this.delta.idRegion;
      //this.doc['region']=this.delta.region;
      this.doc['idCaso']=this.delta.idCaso;
      this.doc['idObservador']=this.delta.idObservador;
      console.info("doc",this.doc, "delta", this.delta);
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad accionPage');
    this.getRegiones("regiones");
    this.servicioFirebase.findColeccion("encuestas","estatus","==","Activo");
   } 
 
  public register() {
    if (this.doc['tipo']=="Encuesta" && !this.doc["idEncuesta"]) {
      this.showPopup("Alerta", "Proporcione encuesta");
      return;            
    }
    this.registrarEncuesta();
    this.servicioFirebase.agregarDocumento (this.coleccion, this.doc );
    this.enviar();
    this.showPopup("Actividades", "Documento creado");            
  }

  public editar() {
    this.registrarEncuesta();
    this.doc.informe = this.doc.informe ? this.doc.informe : "";
    this.doc.informe+="\r"+this.fh+" "+this.servicioFirebase.modelo["usuario"].usuario+": "+this.informe;
    this.servicioFirebase.editarDocumento (this.coleccion, this.doc.id, this.doc );
    this.enviar();
    this.showPopup("Actividades", "Documento actualizado");          
  }

  public borrar() {
    this.presentConfirm(
      "Confirme Baja",
      "Se borrará el documento",
      ()=> {
        this.servicioFirebase.eliminarDocumento (this.coleccion, this.doc.id )  
        .then(res => {
          this.showPopup("Actividades", "Documento borrado") 
        }).catch(err =>
          this.showPopup("Actividades", "Error al borrar")
        );
        this.nav.pop();            
      }
    );
  }

  public registrarEncuesta() {    
    if (this.doc['tipo']=="Encuesta") {
      if (!this.isUpdate) {
        this.doc["idInstancia"]=this.servicioFirebase.getId();
      }
      let encuesta={idRegion:this.doc['idRegion'],idCaso:this.doc['idCaso'],fhInicio:this.doc['fhAlta'],fhFin:this.doc['fhFinPlan']};
      this.servicioFirebase.upsertDocument("encuestas/"+this.doc["idEncuesta"]+"/instancias",this.doc["idInstancia"],encuesta );  
    }
  }

  setIdRegion(coleccion) {
    let ref:string = "regiones/mYB9TZez4ys9WGHJbHJy/regiones/LsyugJFENlqSo8ZQc2iq";
    let region="CdMx/Miguel Hidalgo";
    /*
    let ref:string = coleccion+"/"+this.delta.estado.id;
    let region=this.delta.estado["region"];
    if (this.delta.municipio.id) {
      ref+="/"+coleccion+"/"+this.delta.municipio.id
      region+="/"+this.delta.municipio["region"];
    }
    */
    if (this.delta.colonia.id) {
      ref+="/"+coleccion+"/"+this.delta.colonia.id;
      region+="/"+this.delta.colonia["region"];
    }
    this.doc["idRegion"]=ref;
    this.doc["region"]=region;
  }

  setRegiones(idRegion) {
    console.log("setEdo", idRegion);
    let coleccion="regiones";
    if (!idRegion) return;
    let idx = idRegion.split("/");
    let idxEdo=null, idxMun=null;
    this.servicioFirebase.modelo[coleccion].filter((element,index)=>{
        if (element.id==idx[1]) {
          idxEdo=index;
          this.delta.estado=element;
          return true;
        }      
    });    
    console.log("setMun", idxEdo);
    this.servicioFirebase.modelo[coleccion][idxEdo][coleccion].filter((element,index)=>{
      if (element.id==idx[3]) {
         idxMun=index;
         this.delta.municipio=element;
         return true;
      }      
    });
    console.log("setCol", idxMun);
    this.servicioFirebase.modelo[coleccion][idxEdo][coleccion][idxMun][coleccion].filter((element,index)=>{
      if (element.id==idx[5]) {
         this.delta.colonia=element;
         return true;
      }      
    });
  }

  getRegiones(coleccion) {
    console.log('Consultar');
  //this.servicioFirebase.consultarColecciones(coleccion);
  //
    this.servicioFirebase.consultarColeccion(coleccion).then( snap1 => {
      snap1.forEach((element, index) => {
        let ref:string = coleccion+"/"+element.id+"/"+coleccion;
        this.servicioFirebase.consultarColeccion(ref).then(snap2 =>{
          this.servicioFirebase.modelo[coleccion][index][coleccion]=snap2;
//
          snap2.forEach((element2, index2) => {
            let ref2=ref+"/"+element2.id+"/"+coleccion;
            this.servicioFirebase.consultarColeccion(ref2).then(snap3 =>{
              this.servicioFirebase.modelo[coleccion][index][coleccion][index2][coleccion]=snap3;
              if (this.doc["idRegion"] && this.doc["idRegion"].indexOf(element2.id) >=0) {
                this.setRegiones(this.doc["idRegion"]);
              }
              //
              if (index==0 && index2==5 ){
                this.delta.municipio[this.regiones]=snap3;                
              }
              //                    
            });
          });
//
        });   
      });
    });
  //
  } 

  public validar() {
    let isInvalid:boolean =
           Number(this.doc["avance"]) < 0
        || Number(this.doc["avance"])>100
        || new Date(this.doc["fhAlta"]) > new Date(this.doc["fhFinPlan"])
        || new Date(this.doc["fhAlta"]) > new Date(this.doc["fhFin"])
    return isInvalid;
  }

  //
  public enviar() {
    if (this.doc["idObservador"]>"") {
      this.servicioFirebase.docById("usuarios/"+this.doc["idObservador"])
        .then(snapshot => {
          console.log("Usuario",snapshot);  
          this.servicioDb.sendMessage(snapshot.token,this.doc)
      });
    } else {
      this.servicioFirebase.consultarColeccion("usuarios")
        .then(snapshot => {
          snapshot.forEach(element => {
            if (element.idRegion.includes(this.doc["idRegion"]) && element.token){
              console.log("Usuarios",element);  
              this.servicioDb.sendMessage(element.token,this.doc);
            }
          });
      });
    }     
  }

  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            if (this.createSuccess) {
              this.nav.popToRoot();
            }
          }
        }
      ]
    });
    alert.present();
  }

  presentConfirm(title:string, message:string, funcion:any) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            funcion();
            console.log('Buy clicked');
          }
        }
      ]
    });
    alert.present();
  }

}
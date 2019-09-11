import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { ServicioFirebase } from '../../servicios/firebase.servicio';

@Component({
  selector: 'page-cuestionario',
  templateUrl: 'cuestionario.html'
})
export class cuestionarioPage {

  coleccion="encuestas";
  doc={id:'',instancias:{},respuesta:{}};
  isUpdate=false;
  createSuccess = false;
  delta={idObservador:"", idInstancia:""};

  constructor(
    private servicioFirebase: ServicioFirebase,
    private nav: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController
    ) {
      if (navParams.get('item')) {
        this.isUpdate = true;
        this.delta = navParams.get('item');
      }    
      this.delta.idInstancia="encuestas/EyiOj3b1ejzm96UvbCON/instancias/boOOkwpfTbYi6q9x71eH";
      this.delta.idObservador=this.servicioFirebase.modelo["usuarios"][0].id;
      console.log("Constructor",this.delta);
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Page');
    this.consultarEncuesta();
  }

  public consultarEncuesta() {
    console.log('Consultar', this.delta);
    //
    let refI:string, refE:string, refP:string, refO:string ; 
    refI=this.delta.idInstancia;
    this.servicioFirebase.docById(refI).then( docI => {
      refE=this.coleccion+"/EyiOj3b1ejzm96UvbCON";//+docI.idEcuesta;
      this.servicioFirebase.docById(refE).then( docE => {
        this.servicioFirebase.modelo[this.coleccion]=docE;
        docE["instancias"]=docI;
        refP=refE+"/preguntas";
        this.servicioFirebase.consultarColeccion(refP).then(snapP =>{
          docE["preguntas"]=snapP;
          snapP.forEach((element, index) => {
            refO = refP+"/"+element.id+"/opciones";
            this.servicioFirebase.consultarColeccion(refO).then(snapO =>{
              docE["preguntas"][index]["opciones"]=snapO;
              console.log(docE);
              this.doc=docE;
            });   
          });                
        });
      });
    });
    console.log("Consultar Encuesta",this.servicioFirebase.modelo[this.coleccion]);
    //
  }

  public setRespuestas() {
    console.log("setRespuestas",this.doc);
    let respuesta:any;
    let cuestionario={idObservador:this.delta.idObservador,fecha:new Date()};
    let refC:string = this.delta.idInstancia+"/cuestionarios";
    this.servicioFirebase.agregarDocumento(refC, cuestionario ).then(res => {
      cuestionario["id"]=res.id;
      console.log("Cuestionario",cuestionario);  
      let refR=refC+"/"+cuestionario["id"]+"/respuestas";
      for (let pregunta of this.doc["preguntas"]){
        console.log("pregunta",pregunta)
        switch (pregunta.tipo) {
          case "cerrada":
            respuesta={idPregunta:pregunta.id,respuesta:pregunta.respuesta};
            this.register(refR,respuesta);
            console.log("cerrada",pregunta, pregunta.respuesta);
            break;          
          case "multiple":
            console.log("multiple", pregunta.opciones);        
            for (let opcion of pregunta.opciones) {
              if (opcion.isChecked) {
                respuesta={idPregunta:pregunta.id,idOpcion:opcion.id,respuesta:opcion.valor};
                this.register(refR,respuesta);
                console.log("Respuesta",opcion.valor);
              }
            }
            break;      
          default: //abierta
            respuesta={idPregunta:pregunta.id,respuesta:pregunta.respuesta};
            this.register(refR,respuesta);
            console.log("abierta",pregunta, pregunta.respuesta);
            break;
        }
      }
      this.showPopup("Encuestas", "Cuestionario agragado")        
    })
  }

  public register(ref,doc) {
    {
      console.log("Insert",ref);
      this.servicioFirebase.agregarDocumento(ref, doc ) 
      .then(res => {
        console.log("idInsert;", res.id);
        doc.id=res.id;        
      }).catch(err =>
        this.showPopup("Error", "Document update.")
      );
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
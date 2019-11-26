import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ServicioFirebase } from '../../servicios/firebase.servicio';

declare var google;

@IonicPage()
@Component({
  selector: 'page-usuario',
  templateUrl: 'usuario.html',
})
export class UsuarioPage {

  coleccion="usuarios";
  regiones="regiones";
  isUpdate=false; 
  createSuccess = false;
  forma = {id:'', confirmation_password: '' };
  doc = { id: "",pass:""};
  file:any;
  delta={estado:{id:''}, municipio:{id:''},colonia:{id:''}};

  map:any;

  constructor(
    private servicioFirebase: ServicioFirebase,
    private nav: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController
    ) {
      this.servicioFirebase.modelo[this.regiones]=[];
      if (navParams.get('item')) {
        this.isUpdate = true;
        this.doc = navParams.get('item');
        this.forma.confirmation_password=this.doc.pass;
      }    
      console.info("usuario",this.doc);
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad usuarioPage');
    this.getRegiones(this.regiones);
  }

  public register() {
    //Validar
    if (this.doc.pass != this.forma.confirmation_password) {
      this.showPopup("Error", 'The password confirmation does not match.');
    } else 
    if (this.file) {
        this.servicioFirebase.fileUpload(this.file).then(fileInfo=>{
        this.doc["foto"]=fileInfo.downloadUrl;
        this.servicioFirebase.agregarDocumento("usuarios", this.doc );
        this.servicioFirebase.createUser(this.doc["correo"],this.doc.pass);    
        this.showPopup("Success", "Document created.");          
      })
    } else {
      this.servicioFirebase.agregarDocumento("usuarios", this.doc ); 
      this.servicioFirebase.createUser(this.doc["correo"],this.doc.pass);   
      this.showPopup("Success", "Document created.");          
    }
  }

  public editar() {
    if (this.file) {
      this.servicioFirebase.fileUpload(this.file).then(fileInfo=>{
      this.doc["foto"]=fileInfo.downloadUrl;
      this.servicioFirebase.editarDocumento (this.coleccion, this.doc.id, this.doc );
      this.showPopup("Success", "Document updated.");          
    })} else {
      this.servicioFirebase.editarDocumento (this.coleccion, this.doc.id, this.doc );
      this.servicioFirebase.createUser(this.doc["correo"],this.doc.pass);   
      this.showPopup("Success", "Document updated.");          
    }
  }

  public borrar() {
    this.servicioFirebase.eliminarDocumento (this.coleccion, this.doc.id );  
    this.showPopup("Success", "Document delete."); 
  }

  setFile(event) {
    this.file = event.target.files[0];
    this.doc['foto']='data:image/jpeg;base64,'+this.file;
    console.log("File:",this.file);
    var reader = new FileReader();
    reader.onload = function (fd) {
      let fn = document.getElementById("idImg")['src']=fd.target['result'];
    };
    reader.readAsDataURL(this.file);
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

  setIdRegion(coleccion) {
    let ref:string = coleccion+"/"+this.delta.estado.id+"/"+coleccion+"/"+this.delta.municipio.id+"/"+coleccion+"/"+this.delta.colonia.id;
    this.doc["idRegion"]=ref;
    this.doc["region"]=this.delta.estado["region"]+"/"+this.delta.municipio["region"]+"/"+this.delta.colonia["region"];
    this.loadMap(this.delta.colonia);
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
    this.loadMap(this.delta.colonia);
  }

  getRegiones(coleccion) {
    console.log('Consultar');
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
                if (this.doc["idRegion"] && this.doc["idRegion"].indexOf(element2.id) >=0 && this.isUpdate) this.setRegiones(this.doc["idRegion"]);                  
              });
            });
  //
          });   
        });
    });
  //
  }
   
  loadMap(mapa:any){
    console.log("LoadMap", mapa);
    let latitude = Number(mapa.latitude);
    let longitude = Number(mapa.longitude);
    let myLatLng = {lat: latitude, lng: longitude};     
    // create a new map by passing HTMLElement
    let mapEle: HTMLElement = document.getElementById('mapauser');
    // create map
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 12
    });
    // crete marker
    let marker = new google.maps.Marker({
      position: myLatLng,
      map: this.map,
      title: 'Centro'
    });
    // 
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEle.classList.add('show-map');
      google.maps.event.trigger(mapEle, 'resize');
    });
    //
    var poligono = new google.maps.Polygon({
      path: mapa.demarcacion,
      map: this.map,
      strokeColor: 'rgb(255, 0, 0)',
      fillColor: 'rgb(255, 255, 0)',
      strokeWeight: 4,
    });
    console.log("Mapa",this.map);
    google.maps.event.trigger(mapEle, 'resize');
  }

}
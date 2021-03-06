import { Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

//import { AngularFireAuthModule } from "@angular/fire/auth";
//import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
// ====================================================================================================================
export class ServicioFirebase {
  //-------------------------------------------------------------------------------------------------------------------
  public modelo=[{usuario:{roles:""}}];
  public model=[];
  public roles:string="Administrador";
  public that=this;
  constructor(
              public afs: AngularFirestore,
              public storage: AngularFireStorage
              //public auth: AngularFireAuthModule
              ) {}

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Método genérico para subir elementos a firebase.
  // params: objeto: objeto javascript, coleccion: nombre de la colección
  public agregarDocumento(coleccion: string, objeto: any){
    delete objeto.id;
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(coleccion).add(objeto)
      .then(
        res => resolve(res),
        err => reject(err)
      );
    });
  }

  public upsertDocument( coleccion: string, id: string, doc: any){
    console.log("Upsert",coleccion,id,doc);
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(coleccion).doc(id).set(doc)
      .then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }

  public getId(){  
    return this.afs.createId();
  }

  public agregarSubDocumento(id:string, coleccion: string, doc: any){
    let objeto = Object.assign({}, doc);  
    delete objeto.id;  
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(coleccion).doc(id).collection(coleccion).add(objeto)
      .then(
        res => resolve(res),
        err => reject(err)
      );
    });
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Método genérico para editar un documento en firebase, es necesario que el objeto tenga el id inyectado o pasado como parámetro
  // params: objeto: objeto javascript, colección: nombre de la colección.
  public editarDocumento( coleccion: string, id: string, doc: any){
    //if(id != null)
    //objeto.id = id;
    let objeto = Object.assign({}, doc);  
    delete objeto.id;  
  
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(coleccion).doc(id).update(objeto)
      .then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Método genérico para eliminar un documento en firebase
  // params: id del documento, colección
  public eliminarDocumento(coleccion, id){
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(coleccion).doc(id).delete()
      .then(
        res => resolve(res),
        err => reject(err)
      );
    });
  }
  
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Método genérico para obtener una colección
  // params: colección: nombre de la colección
  // para leer un elemento obtenido com un objeto normal javascript: respuesta[i].payload.doc.data()
  //item['municipios']=[{id:1,cvMunicipio:"CV",municipio:"mun"}];
  public consultarColeccion(coleccion: string){
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(coleccion).snapshotChanges().subscribe(querySnapshot => {
        var snapshot = [];
        querySnapshot. forEach(function(doc) {
          var item=doc.payload.doc.data();
          item['id']=doc.payload.doc.id;
          snapshot.push(item);
        });
        console.log("Consulta: ", coleccion, snapshot );
        this.modelo[coleccion]=snapshot;
        resolve(snapshot);
      })      
    })
  }

  public getColeccion(coleccion: string){
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(coleccion).snapshotChanges().subscribe(querySnapshot => {
        var snapshot = {};
        querySnapshot. forEach(function(doc) {
          snapshot[doc.payload.doc.id]=doc.payload.doc.data();
        });
        console.log("Consulta: ", coleccion, snapshot );
        this.model[coleccion]=snapshot;
        resolve(snapshot);
      })      
    })
  }

  public findOrderCollection(coleccion: string, campo:string, operador, value) {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(coleccion, ref => ref.where(campo, operador, value).orderBy('fhAlta'))
        .snapshotChanges().subscribe(querySnapshot => {
          var snapshot = [];
          let ids = [];
          querySnapshot. forEach(function(doc) {
            var item=doc.payload.doc.data();
            item['id']=doc.payload.doc.id;
            snapshot.push(item);
            ids["id"]=doc.payload.doc.id;
          });
          console.log("Consulta: ", coleccion, campo, value, snapshot );
          this.modelo[coleccion]=snapshot;
          resolve(snapshot);
          })     
    });
  }

  public findOrderCaso(coleccion: string) {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(coleccion, ref => ref.where("estatus", "==", "Activo").orderBy('dateCreation'))
        .snapshotChanges().subscribe(querySnapshot => {
          var snapshot = [];
          let ids = [];
          querySnapshot. forEach(function(doc) {
            var item=doc.payload.doc.data();
            item['id']=doc.payload.doc.id;
            snapshot.push(item);
            ids["id"]=doc.payload.doc.id;
          });
          console.log("Consulta: ", coleccion, snapshot );
          this.modelo[coleccion]=snapshot;
          resolve(snapshot);
          })     
    });
  }

  public getOrderCollection(coleccion: string) {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(coleccion, ref => ref.orderBy('fhAlta'))
        .snapshotChanges().subscribe(querySnapshot => {
          var snapshot = [];
          querySnapshot. forEach(function(doc) {
            var item=doc.payload.doc.data();
            item['id']=doc.payload.doc.id;
            snapshot.push(item);
          });
          console.log("Consulta: ", coleccion, snapshot );
          this.modelo[coleccion]=snapshot;
          resolve(snapshot);
          })     
    });
  }

  public docById(doc: string){
    console.log("doc", doc)
    return new Promise<any>((resolve, reject) => {
      this.afs.doc(doc).ref.get()
      .then(querySnapshot => {
        let snapshot = querySnapshot.data();
        snapshot['id'] =  querySnapshot.id;
        //console.log("docById", querySnapshot.ref.parent , "par", querySnapshot.ref.parent.parent, "path", querySnapshot.ref.path); 
        resolve(snapshot);
      })
    })
  }

  public findById(coleccion: string, id:string){
    console.log("Coll", coleccion,"cfb",id)
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(coleccion).doc(id).ref.get()
      .then(querySnapshot => {
        let snapshot = querySnapshot.data();
        snapshot['id'] = id;
        console.log("snapshot", snapshot); 
        resolve(snapshot);
      })
    })
  }

  public findColeccion(coleccion: string, campo:string, operador, value){
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(coleccion, ref => ref.where(campo, operador, value))
        .snapshotChanges().subscribe(querySnapshot => {
          var snapshot = [];
          querySnapshot. forEach(function(doc) {
            var item=doc.payload.doc.data();
            item['id']=doc.payload.doc.id;
            snapshot.push(item);
          });
          console.log("Consulta: ", coleccion, snapshot );
          this.modelo[coleccion]=snapshot;
          resolve(snapshot);
        })     
    });
  }

  public consultarColecciones(coleccion: string){
    return new Promise<any>((resolve, reject) => {
      this.afs.collectionGroup(coleccion).snapshotChanges().subscribe(querySnapshot => {
        var snapshot = [];
        querySnapshot.forEach(function(doc) {          
          var item=doc.payload.doc.data();
          item['id']=doc.payload.doc.id;
          snapshot.push(item);
        });
        console.log("Current snapshot 0: ", snapshot, snapshot.length);
        this.modelo[coleccion]=snapshot;
        resolve(snapshot);
      })      
    })
  }

public findChild(coleccion: string, subcoleccion:string, document: string){
  return new Promise<any>((resolve, reject) => {
    this.afs.collection(coleccion).doc(document)
            .collection(subcoleccion).snapshotChanges().subscribe(querySnapshot => {
      var snapshot = [];
      querySnapshot.forEach(function(doc) {          
        var item=doc.payload.doc.data();
        item['id']=doc.payload.doc.id;
        snapshot.push(item);
      });
      console.log("Current SUB snapshot 0: ", snapshot[0], snapshot.length);
      resolve(snapshot);
    })      
  })
}            

public watchColeccion(coleccion:string) {
    var db = this.afs.firestore;
    return new Promise<any>((resolve, reject) => {
      db.collection(coleccion)
        .onSnapshot(function(querySnapshot) {
          var snapshot = [];
          querySnapshot.forEach(function(doc) {
            var item=doc.data();
            item.id=doc.id;
            snapshot.push(item);
          });
          console.log("Current snapshot 0: ", snapshot[0], snapshot.length);
          console.log("Current snapshot 1: ", snapshot[1]);
          resolve(snapshot);
          this.saveTextAsFile(snapshot);           
        });
    }); 
  }
  
  public getInstancias(coleccion,region) {
    console.log('Instancias');
    let f = new Date();
    let fecha=f.getFullYear() + "/" + (f.getMonth() +1) + "/" + f.getDate() ;
    this.modelo["encuestaInstancia"]=[];
    return new Promise<any>((resolve, reject) => {
      this.consultarColeccion(coleccion).then( snap1 => {
        console.log("snap1", snap1);
        snap1.forEach((element1, index1) => {
          let ref1:string = coleccion+"/"+element1.id+"/instancias";
          //, ref => ref.where("fhFin", ">", fecha)        
          this.afs.collection(ref1)
            .snapshotChanges().subscribe(snap2 => {
              console.log("snap2", snap2);
              let max:any;
              snap2.forEach(element2=>{
                let doc=element2.payload.doc.data();
                doc["id"]=element2.payload.doc.id;
                console.log("MaxInstancia",region,doc["idRegion"],doc["fhFin"]);
                if(region.includes(doc["idRegion"])) {
                  if (!max || max.fhFin<doc["fhFin"]) {
                    max=doc;
                  }  
                }
              })
              if (max) {
                console.log("max",max);
                element1.instancia=max;
                this.modelo["encuestaInstancia"].push(element1);  
              }
          });   
        });
        console.log("resolve",snap1);
        resolve(snap1);
      });
    });
  }

  public uploadDocumento(coleccion: string, objeto: any){
    delete objeto.id;
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(coleccion).add(objeto)
      .then(
        res => resolve(res),
        err => reject(err)
      );
    });
  }

// File Upload
public fileUpload(data:any) {
  //.putString(data, 'base64', {contentType: 'image/png'})
  //var imagen = 'data:image/jpeg;base64,' + data;
  //const file = this.storage.ref('casos/evidencias/file.jpg');
  console.log("Subiendo", data, "fin");
  let coleccion='casos/evidencias/'+data.name;
  const file = this.storage.ref(coleccion);
  return new Promise<any>((resolve, reject) => {
    file.put(data)
    .then(snapshot => {
      console.log("success",snapshot);
      file.getDownloadURL().subscribe(downloadUrl=>{
        console.log(downloadUrl);
        let fileInfo = {
          name: snapshot.metadata.name,
          created: snapshot.metadata.timeCreated,
          downloadUrl: downloadUrl,
          fullPath: snapshot.metadata.fullPath,
          contentType: snapshot.metadata.contentType,
          size: snapshot.metadata.size }
        resolve(fileInfo);  
        //this.agregarDocumento('files',fileInfo);
      }) 
    }, err => {
      console.log("err",err);
      reject(err);
    })
  })
}       
  
public imageUpload(data:any) {
  console.log("Subiendo", data, "fin");
  //var imagen = 'data:image/jpeg;base64,' + data;
  const file = this.storage.ref('casos/evidencias/file.jpg');
  file
  .putString(data, 'base64', {contentType: 'image/jpeg'})
  .then(snapshot => {
      console.log("success",snapshot);
      file.getDownloadURL().subscribe(downloadUrl=>{
        console.log(downloadUrl);
        let fileInfo = {
          name: snapshot.metadata.name,
          created: snapshot.metadata.timeCreated,
          url: downloadUrl,
          fullPath: snapshot.metadata.fullPath,
          contentType: snapshot.metadata.contentType,
          size: snapshot.metadata.size }
        this.agregarDocumento('files',fileInfo);
      }) 
    }, err => {
      console.log("err",err);
    })
  } 

   // Authentication
  
  createUser(email, password) {
    console.log('Creando el usuario con email ' + email);  
    this.afs.firestore.app.auth().createUserWithEmailAndPassword(email, password)
    .then(function (user) {
      console.log('¡Creamos al usuario!');
    })
    .catch(function (error) {
      console.error(error)
    });
  }
  
  loginUser(a_email, a_password) {
    console.log('Loging user ' + a_email);
    return new Promise<any>((resolve, reject) => {
      let email="ricardo.romero@people-media.com.mx";
      let crashtapen="Ventana6561";  
      this.afs.firestore.app.auth().signInWithEmailAndPassword(email, crashtapen)
      .then(function (user) {
        console.log('Credenciales correctas, ¡bienvenido!');
        resolve(email);
      })
      .catch(function (error) {
        console.log(error);
      });
    });
  }
  
  logoutUser() {
    this.afs.firestore.app.auth().signOut();
    console.log("Logout User");
  }
 

} // End Service

/*
    return new Promise<any>((resolve, reject) => {
      file.putString(data, 'data_url')
      .then(snapshot => {
        resolve(snapshot.downloadURL)
      }, err => {
        reject(err);
      })
    });
//
//    
    file.putString(data)
    .then((metainfo:any) => {
        let fileInfo = {
          created: metainfo.timeCreated,
          url: metainfo.downloadURLs[0],
          fullPath: metainfo.fullPath,
          contentType: metainfo.contentType
        }
        this.afs.collection('files').add(fileInfo);
      }
    );
//
//    file.putString(data, 'base64', {contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
//      .then(savedProfilePicture => {
//        console.log(savedProfilePicture.downloadURL);
//    }).catch(err=>{console.log(err)})

  uploadFile(event) {
    const file = event.target.files[0];
    const filePath = 'casos/evidencias/myFile.xlsx';
    const ref = this.angularStorage.ref(filePath);
    const task = ref.put(file);
  }

  saveTextAsFile(snapshot)
{
  console.log("inicia saveFile");      
// grab the content of the form field and place it into a variable
    //var textToWrite = document.getElementById("inputTextToSave").value;
    var textToWrite = snapshot;
//  create a new Blob (html5 magic) that conatins the data from your form feild
    var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
// Specify the name of the file to be saved
    var fileNameToSaveAs = "C:/Users/rromero/Documents/Ionic/myFirebaseFile.txt";

// Optionally allow the user to choose a file name by providing 
// an imput field in the HTML and using the collected data here
// var fileNameToSaveAs = txtFileName.text;
 
// create a link for our script to 'click'
    var downloadLink = document.createElement("a");
//  supply the name of the file (from the var above).
// you could create the name here but using a var
// allows more flexability later.
    downloadLink.download = fileNameToSaveAs;
// provide text for the link. This will be hidden so you
// can actually use anything you want.
    downloadLink.innerHTML = "My Hidden Link";
    
// allow our code to work in webkit & Gecko based browsers
// without the need for a if / else block.
    window.URL = window.URL; // || window.webkitURL;
          
// Create the link Object.
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
// when link is clicked call a function to remove it from
// the DOM in case user wants to save a second file.
    downloadLink.onclick = this.destroyClickedElement;
// make sure the link is hidden.
    downloadLink.style.display = "none";
// add the link to the DOM
    document.body.appendChild(downloadLink);
    
// click the new link
    downloadLink.click();
console.log("termina saveFile");      

}
 
destroyClickedElement(event)
{
// remove the link from the DOM
    document.body.removeChild(event.target);
}
*/

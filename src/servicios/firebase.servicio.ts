import { Injectable } from "@angular/core";
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
//import { Storage } from '@ionic/storage';

@Injectable()
// ====================================================================================================================
export class ServicioFirebase {
  //-------------------------------------------------------------------------------------------------------------------
  public modelo=[];
  public that=this;
  constructor(public afs: AngularFirestore,
              public storage:  AngularFireStorage
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
        let ids = [];
        querySnapshot. forEach(function(doc) {
          var item=doc.payload.doc.data();
          item['id']=doc.payload.doc.id;
          snapshot.push(item);
          ids["id"]=doc.payload.doc.id;
        });
        console.log("Consulta: ", coleccion, querySnapshot );
        this.modelo[coleccion]=snapshot;
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
        .valueChanges().subscribe(snapshot => {
          console.log("Consulta: ", coleccion, snapshot );
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
        console.log("Current snapshot 0: ", snapshot[0], snapshot.length);
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
} 
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

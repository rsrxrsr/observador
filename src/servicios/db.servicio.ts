import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

@Injectable()
// ====================================================================================================================
export class ServicioDb {
  //-------------------------------------------------------------------------------------------------------------------
  private url ='http://localhost:3000/db';
  public modelo=[];
  constructor(public http:HttpClient) {}
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Select
  public getColeccion(coleccion:string){
    console.log("ServicioDB",coleccion)
    return new Promise<any>((resolve, reject) => {
      this.http.get(this.url).subscribe(
        res => {this.modelo[coleccion]=res,resolve(res)},
        err => reject(err)
      );
    });
  }

  public sendMessageGet(usuario:any,message:any){
    console.log("ServicioFCM",usuario,message);
//  let url = "https://us-central1-proionic-007.cloudfunctions.net/sendMessage?usuario=";
    let url = "https://us-central1-pm-soluciones.cloudfunctions.net/sendMessage";
        url += usuario+"&message="+JSON.stringify(message);
    return new Promise<any>((resolve, reject) => {
      this.http.get(url,{responseType:'text'}).subscribe(
        res => resolve(res),
        err => reject(err)
        );
    });
  }

  public sendMessage(usuario:any,message:any){
    console.log("ServicioFCM",usuario,message)
    //let url = "https://us-central1-proionic-007.cloudfunctions.net/sendMessage?usuario="
    let url = "https://us-central1-proionic-007.cloudfunctions.net/sendMessage?usuario="
            + usuario;
    return new Promise<any>((resolve, reject) => {
      this.http.post(url, JSON.stringify(message), {responseType:'text'}).subscribe(
        res => resolve(res),
        err => reject(err)
        );
    });
  }

  public sendEmail(usuario:any,message:any){
    console.log("ServicioFCM",usuario,message)
    let url = "https://us-central1-pm-soluciones.cloudfunctions.net/sendMail";
    return new Promise<any>((resolve, reject) => {
      this.http.post(url, JSON.stringify(message), {responseType:'text'}).subscribe(
        res => resolve(res),
        err => reject(err)
        );
    });
  }

/*
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

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Método genérico para editar un documento en firebase, es necesario que el objeto tenga el id inyectado o pasado como parámetro
  // params: objeto: objeto javascript, colección: nombre de la colección.
  public editarDocumento( coleccion: string, id: string, doc: any){
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
 */ 
}
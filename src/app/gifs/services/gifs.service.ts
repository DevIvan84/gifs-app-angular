import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({providedIn: 'root'})
export class GifsService {

  public gifList: Gif[] = [];

  //arreglo donde se almacenaran los tags de busqueda
  private _tagsHistory: string [] = [];

  private apiKey: string = 'ewrzWOsnCH6rudVB5UpP2P3zBvJFCFTb';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

  //se inyecta el HttpClient de Angular para hacer peticiones
  constructor( private http: HttpClient) {
    this.loadLocalStorage();
    console.log('Gif Service Ready');
  }

  //metodo get que regresa el arreglo actual , hace una copia del arreglo
  get tagsHistory() {
    return [...this._tagsHistory];
  }


  organizeHistory( tag: string) {

    //convertir a Capitalizado el tag
    tag = tag.toLocaleLowerCase();

    //limpiar la busqueda para no tener tags duplicados y
    if( this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter( (oldTag) => oldTag !== tag);
    }

    //poner primero los recientes
    this._tagsHistory.unshift(tag);
    this._tagsHistory = this.tagsHistory.splice(0,10);
    this.saveLocalStorage();
  }

  //guardar en LocalStorage
  private saveLocalStorage() :void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));

  }

  //recuperar del LocalStorage
  private loadLocalStorage() {
    if( !localStorage.getItem('history') ) return;

    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);

    if(this._tagsHistory.length === 0 ) return;
      this.searchTag( this._tagsHistory[0] );

  }


  //metodo que hace la busqueda del tag y valida que no haya tags o busquedas nulos
  public searchTag( tag: string ) : void {

    if( tag.length === 0 ) return;

    this.organizeHistory( tag );

    //se forman los parametros con clase HttpParams de JS
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q' , tag)

    this.http.get<SearchResponse>(`${this.serviceUrl}/search`, {params} )
              .subscribe( resp => {

                this.gifList = resp.data;
              })
    /* fetch('/search?api_key=ewrzWOsnCH6rudVB5UpP2P3zBvJFCFTb&q=valorant&limit=5')
      .then( resp => resp.json())
      .then( data => console.log(data)); */

  }

}

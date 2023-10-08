import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  constructor() { }

  setCookie(nombreCookie, valorCookie) {
    var cookie = nombreCookie + "=" + encodeURIComponent(valorCookie);
    document.cookie = cookie;
  }

  getCookie(nombreCookie) {
    var cookieArr = document.cookie.split(";");
    for(var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");
        if(nombreCookie == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
  }

  checkCookie(nombre) {
    let cookieRequerida = this.getCookie(nombre);
    if(cookieRequerida == "si"){
      return true;
    } else {
      return false;
    }
  }

  updateCookie(nombreCookie, valorCookie){
    document.cookie = nombreCookie + "=" + valorCookie + "path=/";
  }

  deleteCookie(nombreCookie){
    document.cookie = nombreCookie + "='';path=/; max-age=0";
  }
}
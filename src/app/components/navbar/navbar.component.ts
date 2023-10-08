import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  
  constructor(public servicioLogin:LoginService) { }

  ngOnInit(): void {
    
  }

  cerrarSesion(){
    this.servicioLogin.deleteToken();
    location.href = '#/login';
  }
}
import { Component } from '@angular/core';
import { SessionController } from 'src/app/sesion/infraestructure/SessionController';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [SessionController],
})
export class NavbarComponent {
  
  constructor(private sessionController: SessionController) { }

  public isLoggedIn () {
    return this.sessionController.isLoggedIn();
  }

  public logout(){
    this.sessionController.logout();
    location.href = '#/login';
  }
}
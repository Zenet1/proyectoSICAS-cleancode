import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { CapturadorService } from 'src/app/services/capturador/capturador.service';
import { ValidateController } from '../../validacion/infraestructure/ValidateController';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css'],
  providers: [ValidateController],
})
export class ScannerComponent implements OnInit {
  @ViewChild('escaner', {static: false})
    scanner: ZXingScannerComponent;

  tieneCamaras = false;
  tienePermisos: boolean;
  camarasDisponibles: MediaDeviceInfo[];
  camaraSeleccionada: MediaDeviceInfo = null;
  escaneoRealizado:boolean = false;
  resultadoEscaneo: any;
  resultadoValidacion:boolean;
  nombreAlumno:string;

  constructor(private validateController: ValidateController, private router:Router) { }

  ngOnInit(): void {
    
  }

  nuevoEscaneo(){
    this.resultadoEscaneo = null;
    this.escaneoRealizado = false;
    this.resultadoValidacion = null;
    this.scanner.scanStart();
  }

  enSeleccionCamara(selected){
    const device = this.camarasDisponibles.find((x) => x.deviceId === selected);
    this.camaraSeleccionada = device || null;
  }

  verificar(){
    if(this.resultadoEscaneo != null){
      this.validateController.check(this.resultadoEscaneo).then(
        (respuesta) =>{
          if(respuesta){
            this.nombreAlumno = 'welcome';
            this.resultadoValidacion = true;
          } else {
            this. resultadoValidacion = false;
          }
        }
      );
    }
  }

  cancelar(){
    location.href = '#/inicio-capturador';
    //this.router.navigateByUrl('inicio-capturador');
  }

  scanSuccessHandler(event){
    this.scanner.scanStop();
    this.escaneoRealizado = true;
    this.resultadoEscaneo = event;
  }

  onHasPermission(siTiene:boolean){
    this.tienePermisos = siTiene;
  }

  camerasFoundHandler(event){
    this.camarasDisponibles = event;
    this.tieneCamaras = true;
  }

  camerasNotFoundHandler(event){
    alert('No se han detectado cámaras disponibles en este dispositivo');
  }

  scanErrorHandler(event){
    alert('Ocurrió un error, asegúrese que ha proporcionado los permisos necesarios');
  }
}
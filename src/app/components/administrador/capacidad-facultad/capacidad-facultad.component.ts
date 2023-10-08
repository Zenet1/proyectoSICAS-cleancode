import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdministradorService } from 'src/app/services/administrador/administrador.service';

@Component({
  selector: 'app-capacidad-facultad',
  templateUrl: './capacidad-facultad.component.html',
  styleUrls: ['./capacidad-facultad.component.css']
})
export class CapacidadFacultadComponent implements OnInit {
  formularioCapacidad:FormGroup;
  capacidadActual:any;

  constructor(private servicioAdmin: AdministradorService, private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.formularioCapacidad = this.formBuilder.group({
      porcentaje:[""],
    });
    this.obtenerCapacidadActual();
  }

  guardarCapacidad(){
    this.servicioAdmin.guardarCapacidadFacultad(this.formularioCapacidad.value).subscribe(
      respuesta=>{
        this.capacidadActual = this.obtenerCapacidadActual();
        this.formularioCapacidad.reset();
      },
      error=>{
        alert("Ocurrió un error al guardar la capacidad");
      }
    );
  }

  obtenerCapacidadActual(){
    this.servicioAdmin.obtenerCapacidadActual().subscribe(
      respuesta=>{
        this.capacidadActual = respuesta;
      }
    );
  }
}
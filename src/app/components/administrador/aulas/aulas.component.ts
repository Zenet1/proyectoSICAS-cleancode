import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdministradorService } from 'src/app/services/administrador/administrador.service';

@Component({
  selector: 'app-aulas',
  templateUrl: './aulas.component.html',
  styleUrls: ['./aulas.component.css']
})
export class AulasComponent implements OnInit {
  formAula:FormGroup;
  aulas:any;

  constructor(private servicioAdmin:AdministradorService, private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.formAula = this.formBuilder.group({
      aula:[""],
      capacidad:[""]
    });
    this.obtenerAulas();
  }

  obtenerAulas(){
    this.servicioAdmin.obtenerAulas().subscribe(
      respuesta=>{
        this.aulas = respuesta;
      }
    );
  }

  guardarAula(){
    this.servicioAdmin.guardarAula(this.formAula.value).subscribe(
      respuesta=>{
        this.obtenerAulas();
        this.formAula.reset();
      },
      error=>{
        alert("Ocurrió un error al guardar el aula");
      }
    )
  }
}
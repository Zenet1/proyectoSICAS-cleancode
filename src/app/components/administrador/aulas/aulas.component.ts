import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AulasController } from 'src/app/plantel/aulas/infraestructure/AulaContoller';

@Component({
  selector: 'app-aulas',
  templateUrl: './aulas.component.html',
  styleUrls: ['./aulas.component.css'],
  providers: [AulasController],
})
export class AulasComponent implements OnInit {
  formAula:FormGroup;
  aulas:any;

  constructor(private aulasController: AulasController, private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.formAula = this.formBuilder.group({
      aula:[''],
      capacidad:[''],
    });
    this.obtenerAulas();
  }

  async obtenerAulas(){
    const aulasResponse: any = await this.aulasController.getAllAula();
    this.aulas = aulasResponse.data;
  }

  async guardarAula(){
    const nombreAula =this.formAula.get('aula').value;
    const capacidadAula = this.formAula.get('capacidad').value;
    const idEdificio = 1;

    const data = {
      nombre: nombreAula,
      capacidad: capacidadAula,
      id_edificio: idEdificio,
    };

    const selectedIndex = (event.target as HTMLSelectElement).selectedIndex;
    const nombreEdificio = this.aulas[selectedIndex].edificio.NombreEdificio;
    console.log('here',nombreEdificio);
    await this.aulasController.createAula(data).then(
      (respuesta)=>{
        this.obtenerAulas();
        this.formAula.reset();
      },
      (error)=>{
        alert('Ocurrió un error al guardar el aula');
      }
    );
  }
}
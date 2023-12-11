import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EdificiosController } from 'src/app/plantel/edificios/infraestructure/EdificiosController';
import { OficinasController } from 'src/app/plantel/oficinas/infraestructure/OficinasController';

@Component({
  selector: 'app-oficinas-externo',
  templateUrl: './oficinas-externo.component.html',
  styleUrls: ['./oficinas-externo.component.css'],
  providers: [EdificiosController, OficinasController],
})
export class OficinasExternoComponent implements OnInit {
  formOficina:FormGroup;
  formBuild: FormGroup;
  oficinas:any;
  edificios:[]=[];

  constructor(private formBuilder:FormBuilder,
    private edificiosController: EdificiosController,
    private oficinasController: OficinasController) { }

  ngOnInit(): void {
    this.formOficina = this.formBuilder.group({
      oficina: [''],
      departamento:[''],
      edificio:[''],
    }
    );
    this.formBuild = this.formBuilder.group({
      IDEdificio: [''],

    }
    );
    this.obtenerEdificios();
    this.obtenerOficinas();
  }

  trimCampo(campo:any, valor:any){
    const textoTrim = valor.trim();
    campo.setValue(textoTrim);
  }

  trimForm(){
    this.trimCampo(this.formOficina.controls['oficina'],this.formOficina.controls['oficina'].value);
    this.trimCampo(this.formOficina.controls['departamento'],this.formOficina.controls['departamento'].value);
  }

  async obtenerOficinas(){
    const oficinasResponse: any = await this.oficinasController.getAllOffice();
    this.oficinas = oficinasResponse.data;
  }

  async obtenerEdificios(){
    const edificioResponse: any = await this.edificiosController.getEdificios();
    this.edificios = edificioResponse.data;
  }

  async guardarOficina(){
    this.trimForm();
    const oficina = this.formOficina.get('oficina').value;
    const departamento = this.formOficina.get('departamento').value;
    const id_edificio = parseInt(this.formOficina.get('edificio').value, 10);
    const data = {
      nombre: oficina,
      departamento: departamento,
      id_edificio: id_edificio,
    };
    await this.oficinasController.createOficina(data);
    this.oficinas = this.obtenerOficinas();
    this.formOficina.reset();
    
  }

  eliminarOficina(id:any, indexOficina:any){
    if (window.confirm('¿Desea eliminar la pregunta?')) {
      this.oficinasController.deleteOffice(id).then(
        (respuesta) => {
          this.obtenerOficinas();
        },
        (error) => {
          alert('Ocurrió un error al eliminar la pregunta');
          console.error('Error al eliminar la pregunta:', error);
        }
      );
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CapacityController } from 'src/app/plantel/capacidad/infraestructure/CapacityController';

@Component({
  selector: 'app-capacidad-facultad',
  templateUrl: './capacidad-facultad.component.html',
  styleUrls: ['./capacidad-facultad.component.css'],
  providers: [CapacityController],
})
export class CapacidadFacultadComponent implements OnInit {
  formularioCapacidad:FormGroup;
  capacidadActual:any;

  constructor(private capacityController: CapacityController, private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.formularioCapacidad = this.formBuilder.group({
      porcentaje:[''],
    });
    this.obtenerCapacidadActual();
  }

  async guardarCapacidad() {
    try {
      const capacity = this.formularioCapacidad.get('porcentaje').value;

      await this.capacityController.updateCapacity(capacity);

      this.capacidadActual = this.obtenerCapacidadActual();
      this.formularioCapacidad.reset();
    } catch (error) {
      console.error('Error al guardar la capacidad:', error);
      alert('Ocurrió un error al guardar la capacidad');
    }
  }


  async obtenerCapacidadActual(){
    const capacityResponse: any = await this.capacityController.getCapacity();
    this.capacidadActual = capacityResponse.data;
  }
}
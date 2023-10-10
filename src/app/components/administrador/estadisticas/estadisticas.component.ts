import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdministradorService } from 'src/app/services/administrador/administrador.service';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {
  formEstadisticas:FormGroup;
  programas:any;
  estadisticas:any;
  tipoEstadistica:string;
  siEstadisticasObtenidas:boolean = false;
  bandera:boolean = false;
  // options
  animations: boolean = false;
  showXAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showYAxis: boolean = true;
  showXAxisLabel: boolean = true;
  showYAxisLabelPersonal: boolean = false;
  gradient: boolean = false;
  showLegend: boolean = true;
  legendPosition: string = 'below';
  
  yAxisLabel: string = 'Licenciatura';
  
  xAxisLabel = 'Cantidad';
  customColors = [
    {
      name: "Masculino",
      value: '#F01018'
    },
    {
      name: "Femenino",
      value: '#1C72EB'
    }
  ];
  customColorsPersonal = [
    {
      name: "Profesor",
      value: '#F01018'
    },
    {
      name: "Personal",
      value: '#1C72EB'
    }
  ];
  schemeType: string = 'ordinal';

  constructor(private servicioAdmin:AdministradorService, private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.formEstadisticas = this.formBuilder.group({
      tipo:[""],
      genero:[""],
      fechaInicio:[""],
      fechaFin:[""],
      NombrePlan:[""]
    });
    this.obtenerProgramas();
  }
/* eslint-disable valid-typeof */
  obtenerEstadisticas(){
    this.siEstadisticasObtenidas = false;
    let validacionPeriodo:boolean = this.formEstadisticas.controls['fechaFin'].value >= this.formEstadisticas.controls['fechaInicio'].value;
    if(validacionPeriodo){
      this.servicioAdmin.obtenerEstadisticas(this.formEstadisticas.value).subscribe(
        respuesta=>{
          if(typeof(respuesta) !== null && respuesta.estadisticas.length > 0){
            this.siEstadisticasObtenidas = true;
            this.estadisticas = respuesta.estadisticas;
            this.tipoEstadistica = respuesta.tipo;
          } else {
            alert("No se encontraron estadísticas con los filtros seleccionados")
          }
        },
        error=>{
          alert("Ocurrió un error al obtener las estadísticas")
        }
      );
    } else {
      alert("La fecha de inicio no puede ser mayor que la fecha de fin");
    }
  }
/* eslint-enable valid-typeof */
  eleccionTipo(event){
    if(event == "asistenciapersonal"){
      this.bandera = true;
    } else {
      this.bandera = false;
    }
  }

  obtenerProgramas(){
    this.servicioAdmin.obtenerProgramas().subscribe(
      respuesta=>{
        this.programas = respuesta;
      }
    );
  }

  onActivate(event){

  }

  onDeactivate(event){

  }

  onSelect(event){

  }
}
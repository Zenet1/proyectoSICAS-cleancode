import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenciaPersonalComponent } from './asistencia-personal.component';

describe('AsistenciaPersonalComponent', () => {
  let component: AsistenciaPersonalComponent;
  let fixture: ComponentFixture<AsistenciaPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsistenciaPersonalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsistenciaPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

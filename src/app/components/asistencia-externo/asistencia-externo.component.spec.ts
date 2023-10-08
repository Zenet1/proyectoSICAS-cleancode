import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenciaExternoComponent } from './asistencia-externo.component';

describe('AsistenciaExternoComponent', () => {
  let component: AsistenciaExternoComponent;
  let fixture: ComponentFixture<AsistenciaExternoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsistenciaExternoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsistenciaExternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

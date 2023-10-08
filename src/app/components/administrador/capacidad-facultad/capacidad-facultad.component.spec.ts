import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacidadFacultadComponent } from './capacidad-facultad.component';

describe('CapacidadFacultadComponent', () => {
  let component: CapacidadFacultadComponent;
  let fixture: ComponentFixture<CapacidadFacultadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapacidadFacultadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CapacidadFacultadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

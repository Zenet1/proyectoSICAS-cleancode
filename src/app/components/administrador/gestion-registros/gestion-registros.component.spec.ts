import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionRegistrosComponent } from './gestion-registros.component';

describe('GestionRegistrosComponent', () => {
  let component: GestionRegistrosComponent;
  let fixture: ComponentFixture<GestionRegistrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionRegistrosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionRegistrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

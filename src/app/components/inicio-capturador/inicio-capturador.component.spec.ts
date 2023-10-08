import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioCapturadorComponent } from './inicio-capturador.component';

describe('InicioCapturadorComponent', () => {
  let component: InicioCapturadorComponent;
  let fixture: ComponentFixture<InicioCapturadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InicioCapturadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InicioCapturadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

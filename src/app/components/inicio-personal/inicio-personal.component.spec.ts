import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioPersonalComponent } from './inicio-personal.component';

describe('InicioPersonalComponent', () => {
  let component: InicioPersonalComponent;
  let fixture: ComponentFixture<InicioPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InicioPersonalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InicioPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

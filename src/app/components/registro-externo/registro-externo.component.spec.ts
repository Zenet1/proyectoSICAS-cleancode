import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroExternoComponent } from './registro-externo.component';

describe('RegistroExternoComponent', () => {
  let component: RegistroExternoComponent;
  let fixture: ComponentFixture<RegistroExternoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroExternoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroExternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

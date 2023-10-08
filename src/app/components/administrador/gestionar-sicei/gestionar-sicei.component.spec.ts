import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarSiceiComponent } from './gestionar-sicei.component';

describe('GestionarSiceiComponent', () => {
  let component: GestionarSiceiComponent;
  let fixture: ComponentFixture<GestionarSiceiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionarSiceiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionarSiceiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

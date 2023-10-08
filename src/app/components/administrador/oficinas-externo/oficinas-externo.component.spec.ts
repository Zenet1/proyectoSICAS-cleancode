import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OficinasExternoComponent } from './oficinas-externo.component';

describe('OficinasExternoComponent', () => {
  let component: OficinasExternoComponent;
  let fixture: ComponentFixture<OficinasExternoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OficinasExternoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OficinasExternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

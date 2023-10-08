import { TestBed } from '@angular/core/testing';

import { CapturadorService } from './capturador.service';

describe('CapturadorService', () => {
  let service: CapturadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CapturadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

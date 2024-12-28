import { TestBed } from '@angular/core/testing';

import { FilterPatientService } from './filter-patient.service';

describe('FilterPatientService', () => {
  let service: FilterPatientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterPatientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

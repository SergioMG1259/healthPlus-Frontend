import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterPatientComponent } from './filter-patient.component';

describe('FilterPatientComponent', () => {
  let component: FilterPatientComponent;
  let fixture: ComponentFixture<FilterPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterPatientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

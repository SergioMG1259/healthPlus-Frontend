import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsAppointmentDialogComponent } from './details-appointment-dialog.component';

describe('DetailsAppointmentDialogComponent', () => {
  let component: DetailsAppointmentDialogComponent;
  let fixture: ComponentFixture<DetailsAppointmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsAppointmentDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsAppointmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

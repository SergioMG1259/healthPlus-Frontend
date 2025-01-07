import { TestBed } from '@angular/core/testing';

import { AppointmentOverlayCalendarService } from './appointment-overlay-calendar.service';

describe('EventOverlayCalendarService', () => {
  let service: AppointmentOverlayCalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppointmentOverlayCalendarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

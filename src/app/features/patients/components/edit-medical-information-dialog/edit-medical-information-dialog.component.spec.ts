import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMedicalInformationDialogComponent } from './edit-medical-information-dialog.component';

describe('EditMedicalInformationDialogComponent', () => {
  let component: EditMedicalInformationDialogComponent;
  let fixture: ComponentFixture<EditMedicalInformationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMedicalInformationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMedicalInformationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

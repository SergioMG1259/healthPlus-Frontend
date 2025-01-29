import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBasicInformationDialogComponent } from './edit-basic-information-dialog.component';

describe('EditBasicInformationDialogComponent', () => {
  let component: EditBasicInformationDialogComponent;
  let fixture: ComponentFixture<EditBasicInformationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBasicInformationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditBasicInformationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

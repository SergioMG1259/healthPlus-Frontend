import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAppointemntDialogComponent } from './edit-appointemnt-dialog.component';

describe('EditAppointemntDialogComponent', () => {
  let component: EditAppointemntDialogComponent;
  let fixture: ComponentFixture<EditAppointemntDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAppointemntDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAppointemntDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

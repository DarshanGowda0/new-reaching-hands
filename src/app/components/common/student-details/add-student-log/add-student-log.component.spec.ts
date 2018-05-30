import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStudentLogComponent } from './add-student-log.component';

describe('AddStudentLogComponent', () => {
  let component: AddStudentLogComponent;
  let fixture: ComponentFixture<AddStudentLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStudentLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStudentLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

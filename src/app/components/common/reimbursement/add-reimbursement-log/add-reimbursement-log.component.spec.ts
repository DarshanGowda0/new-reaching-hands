import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReimbursementLogComponent } from './add-reimbursement-log.component';

describe('AddReimbursementLogComponent', () => {
  let component: AddReimbursementLogComponent;
  let fixture: ComponentFixture<AddReimbursementLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddReimbursementLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReimbursementLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

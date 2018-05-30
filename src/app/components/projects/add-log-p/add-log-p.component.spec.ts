import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLogPComponent } from './add-log-p.component';

describe('AddLogPComponent', () => {
  let component: AddLogPComponent;
  let fixture: ComponentFixture<AddLogPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLogPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLogPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

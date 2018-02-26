import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLog3Component } from './add-log3.component';

describe('AddLog3Component', () => {
  let component: AddLog3Component;
  let fixture: ComponentFixture<AddLog3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLog3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLog3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

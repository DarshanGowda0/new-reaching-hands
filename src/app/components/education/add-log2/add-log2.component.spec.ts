import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLog2Component } from './add-log2.component';

describe('AddLog2Component', () => {
  let component: AddLog2Component;
  let fixture: ComponentFixture<AddLog2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLog2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLog2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

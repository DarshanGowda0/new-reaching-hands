import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLog1Component } from './add-log1.component';

describe('AddLog1Component', () => {
  let component: AddLog1Component;
  let fixture: ComponentFixture<AddLog1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLog1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLog1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

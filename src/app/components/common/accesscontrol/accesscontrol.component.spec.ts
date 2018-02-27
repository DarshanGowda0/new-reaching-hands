import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccesscontrolComponent } from './accesscontrol.component';

describe('AccesscontrolComponent', () => {
  let component: AccesscontrolComponent;
  let fixture: ComponentFixture<AccesscontrolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccesscontrolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccesscontrolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

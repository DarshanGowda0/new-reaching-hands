import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCatListing1Component } from './sub-cat-listing1.component';

describe('SubCatListing1Component', () => {
  let component: SubCatListing1Component;
  let fixture: ComponentFixture<SubCatListing1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubCatListing1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubCatListing1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCatListing3Component } from './sub-cat-listing3.component';

describe('SubCatListing3Component', () => {
  let component: SubCatListing3Component;
  let fixture: ComponentFixture<SubCatListing3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubCatListing3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubCatListing3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

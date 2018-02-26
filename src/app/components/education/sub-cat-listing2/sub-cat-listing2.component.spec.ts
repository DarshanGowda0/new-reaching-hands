import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCatListing2Component } from './sub-cat-listing2.component';

describe('SubCatListing2Component', () => {
  let component: SubCatListing2Component;
  let fixture: ComponentFixture<SubCatListing2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubCatListing2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubCatListing2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

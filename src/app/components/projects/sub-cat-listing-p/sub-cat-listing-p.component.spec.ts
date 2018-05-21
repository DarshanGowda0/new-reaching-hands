import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCatListingPComponent } from './sub-cat-listing-p.component';

describe('SubCatListingPComponent', () => {
  let component: SubCatListingPComponent;
  let fixture: ComponentFixture<SubCatListingPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubCatListingPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubCatListingPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

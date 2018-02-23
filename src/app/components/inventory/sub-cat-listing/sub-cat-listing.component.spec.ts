import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCatListingComponent } from './sub-cat-listing.component';

describe('SubCatListingComponent', () => {
  let component: SubCatListingComponent;
  let fixture: ComponentFixture<SubCatListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubCatListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubCatListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

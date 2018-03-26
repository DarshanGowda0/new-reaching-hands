import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCategoryLevelReportComponent } from './sub-category-level-report.component';

describe('SubCategoryLevelReportComponent', () => {
  let component: SubCategoryLevelReportComponent;
  let fixture: ComponentFixture<SubCategoryLevelReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubCategoryLevelReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubCategoryLevelReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

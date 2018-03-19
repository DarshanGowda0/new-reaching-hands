import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryLevelReportComponent } from './category-level-report.component';

describe('CategoryLevelReportComponent', () => {
  let component: CategoryLevelReportComponent;
  let fixture: ComponentFixture<CategoryLevelReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryLevelReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryLevelReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

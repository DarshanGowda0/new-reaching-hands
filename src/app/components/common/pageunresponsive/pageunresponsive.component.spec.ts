import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageunresponsiveComponent } from './pageunresponsive.component';

describe('PageunresponsiveComponent', () => {
  let component: PageunresponsiveComponent;
  let fixture: ComponentFixture<PageunresponsiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageunresponsiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageunresponsiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

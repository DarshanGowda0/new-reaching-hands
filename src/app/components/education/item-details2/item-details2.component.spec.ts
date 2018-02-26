import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDetails2Component } from './item-details2.component';

describe('ItemDetails2Component', () => {
  let component: ItemDetails2Component;
  let fixture: ComponentFixture<ItemDetails2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemDetails2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDetails2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

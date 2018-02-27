import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDetails3Component } from './item-details3.component';

describe('ItemDetails3Component', () => {
  let component: ItemDetails3Component;
  let fixture: ComponentFixture<ItemDetails3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemDetails3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDetails3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ManageImagePage } from './manage-image.page';

describe('ManageImagePage', () => {
  let component: ManageImagePage;
  let fixture: ComponentFixture<ManageImagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageImagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageImagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ManageVitalsPage } from './manage-vitals.page';

describe('ManageVitalsPage', () => {
  let component: ManageVitalsPage;
  let fixture: ComponentFixture<ManageVitalsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageVitalsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageVitalsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

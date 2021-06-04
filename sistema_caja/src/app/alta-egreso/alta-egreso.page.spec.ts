import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AltaEgresoPage } from './alta-egreso.page';

describe('AltaEgresoPage', () => {
  let component: AltaEgresoPage;
  let fixture: ComponentFixture<AltaEgresoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltaEgresoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AltaEgresoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

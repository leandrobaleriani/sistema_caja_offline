import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AltaIngresoPage } from './alta-ingreso.page';

describe('AltaIngresoPage', () => {
  let component: AltaIngresoPage;
  let fixture: ComponentFixture<AltaIngresoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltaIngresoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AltaIngresoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

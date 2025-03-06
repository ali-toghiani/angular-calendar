import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAppointmentModalComponent } from './create-appointment-modal.component';

describe('CreateAppointmentModalComponent', () => {
  let component: CreateAppointmentModalComponent;
  let fixture: ComponentFixture<CreateAppointmentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAppointmentModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAppointmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

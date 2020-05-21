import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

import { InterventionStatusPipe } from '@shared/pipes/intervention-status.pipe';
import { Intervention } from '@shared/domain/intervention.model';
import { InterventionStatus } from '@shared/domain/intervention.status';

import { DetailsBasicComponent } from './details-basic.component';

describe('DetailsBasicComponent', () => {
  let component: DetailsBasicComponent;
  let fixture: ComponentFixture<DetailsBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatListModule, MatIconModule],
      declarations: [DetailsBasicComponent, InterventionStatusPipe],
      providers: [InterventionStatusPipe],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsBasicComponent);
    component = fixture.componentInstance;
    component.intervention = { status: InterventionStatus.InProgress } as Intervention;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

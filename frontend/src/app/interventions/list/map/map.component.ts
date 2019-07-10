import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Intervention } from '../../types';
import { InterventionsService } from '../../interventions.service';

@Component({
  selector: 'app-interventions-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class InterventionsMapComponent implements OnInit {
  interventions$: Observable<Intervention[]>;

  constructor(private interventionsService: InterventionsService) {}

  ngOnInit() {
    this.interventions$ = this.interventionsService.getInterventions();
  }
}

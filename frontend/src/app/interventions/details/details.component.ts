import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class InterventionDetailsComponent implements OnInit {

  constructor(private router: Router) {
    console.log(this.router.getCurrentNavigation().extras.state);
  }

  ngOnInit() {
  }

}

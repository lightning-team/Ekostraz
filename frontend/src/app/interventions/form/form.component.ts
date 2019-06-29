import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Intervention } from '../intervention';
import { InterventionsService } from '../interventions.service'

interface InterventionParams {
  interventionId: number;
}

const interventionStatuses = [
  {
    value: '1',
    viewValue: 'Do weryfikacji',
  },
  {
    value: '2',
    viewValue: 'Do podjęcia',
  },
  {
    value: '3',
    viewValue: 'W toku',
  },
  {
    value: '4',
    viewValue: 'Zamknięta',
  },
];

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class InterventionsFormComponent implements OnInit {
  private interventionId: number | null;

  interventionStatuses = interventionStatuses;

  inPrivateMode = false;

  interventionForm = this.formBuilder.group({
    date: [''],
    name: [''],
    description: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', Validators.email],
    status: ['', Validators.required],
    address: this.formBuilder.group({
      street: ['', Validators.required],
      number: ['', Validators.required],
      city: ['', Validators.required],
    }),
  });

  constructor(private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private interventionService: InterventionsService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: InterventionParams) => {
      this.interventionId = params.interventionId || null;
      if (!!this.interventionId) {
        // TODO: Add authorization check whether a person is an Ekostraz worker
        // or just add a route guard to allow ekostraz workers only
        this.inPrivateMode = true;
      }
    });
  }

  isInvalid(controlName: string) {
    return !this.interventionForm.get(controlName).valid
      && this.interventionForm.get(controlName).touched;
  }

  onSubmit(interventionFormValue: any) {
    let data = new Intervention(interventionFormValue);
    this.interventionService.addPublicForm(data).subscribe(response => console.log(response));
  }
}

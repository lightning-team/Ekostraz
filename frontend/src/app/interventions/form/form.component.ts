import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Intervention } from '../intervention';
import { InterventionsService } from '../interventions.service'

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class InterventionsFormComponent implements OnInit {
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

  constructor(private formBuilder: FormBuilder, private interventionService: InterventionsService) { }

  ngOnInit() {
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

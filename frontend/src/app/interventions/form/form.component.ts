import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

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
    telephone: ['', Validators.required],
    email: ['', Validators.email],
    status: ['', Validators.required],
    address: this.formBuilder.group({
      street: ['', Validators.required],
      number: ['', Validators.required],
      city: ['', Validators.required],
    }),
  });

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
  }

  isInvalid(controlName: string) {
    return !this.interventionForm.get(controlName).valid
      && this.interventionForm.get(controlName).touched;
  }

  onFormSubmit() {
    alert('Submitted');
  }
}

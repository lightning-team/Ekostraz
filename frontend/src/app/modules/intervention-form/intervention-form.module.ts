import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
} from '@angular/material';

import {InterventionFormComponent} from './form/form.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
    declarations: [InterventionFormComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        SharedModule,
    ],
    exports: [InterventionFormComponent],
})
export class InterventionFormModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatIconModule,
  MatListModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSnackBarModule,
  MatTableModule,
  MatTooltipModule,
} from '@angular/material';

import { AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';

import { InterventionsRoutingModule } from './interventions-routing.module';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { DetailsContainerComponent } from './details/details.container.component';
import { InterventionsService } from './interventions.service';
import { TableComponent } from './list/table/table.component';
import { MapComponent } from './map/map.component';
import { NewFormComponent } from './new-form/new-form.component';
import { EditFormComponent } from './edit-form/edit-form.component';
import { InterventionFormModule } from '@interventionForm/intervention-form.module';
import { SharedModule } from '@shared/shared.module';
import { CommentsComponent } from './details/comments/comments.component';
import { MapFilterComponent } from './map/map-filter/map-filter.component';
import { FileListComponent } from './details/file-list/file-list.component';

const MaterialImports = [
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatIconModule,
  MatListModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatTableModule,
  MatRadioModule,
  MatTooltipModule,
];

@NgModule({
  declarations: [
    ListComponent,
    DetailsComponent,
    DetailsContainerComponent,
    TableComponent,
    MapComponent,
    NewFormComponent,
    EditFormComponent,
    CommentsComponent,
    MapFilterComponent,
    FileListComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    InterventionsRoutingModule,
    InterventionFormModule,
    ReactiveFormsModule,
    // TODO: When we'll be planning and implementing auth/login, we should also provide mechanics to:
    // 1. For local development: Fetch the google maps key from local.secrets.json and dynamically inject it to the app
    // (e.g. route resolvers/guards for components with map).
    // 2. For higher envs: Fetch the key for Azure functions and for Google Maps from external services.
    AgmCoreModule.forRoot({
      // TODO: Temporary solution - paste the key manually during local development.
      apiKey: '',
    }),
    AgmJsMarkerClustererModule,
    ...MaterialImports,
  ],
  providers: [InterventionsService],
})
export class InterventionsModule {}

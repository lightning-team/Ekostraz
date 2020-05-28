import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import {
  MatCardModule,
  MatBadgeModule,
  MatExpansionModule,
  MatListModule,
  MatPaginatorModule,
  MatRadioModule,
  MatTableModule,
} from '@angular/material';

import { AgmCoreModule, LAZY_MAPS_API_CONFIG } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';

import { mapsConfigFactory } from './provider-factories';

import { InterventionFormModule } from '@interventionForm/intervention-form.module';
import { SharedModule } from '@shared/shared.module';

import { InterventionsRoutingModule } from './interventions-routing.module';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { DetailsContainerComponent } from './details/details.container.component';
import { InterventionsService } from './interventions.service';
import { TableComponent } from './list/table/table.component';
import { MapComponent } from './map/map.component';
import { NewFormComponent } from './new-form/new-form.component';
import { EditFormComponent } from './edit-form/edit-form.component';
import { CommentsComponent } from './details/comments/comments.component';
import { MapFilterComponent } from './map/map-filter/map-filter.component';
import { FileListComponent } from './details/file-list/file-list.component';
import { DetailsBasicComponent } from './details/details-basic/details-basic.component';

const MaterialImports = [
  MatCardModule,
  MatBadgeModule,
  MatExpansionModule,
  MatListModule,
  MatPaginatorModule,
  MatRadioModule,
  MatTableModule,
];

@NgModule({
  declarations: [
    ListComponent,
    DetailsBasicComponent,
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
    SharedModule,
    InterventionsRoutingModule,
    InterventionFormModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot(),
    AgmJsMarkerClustererModule,
    ...MaterialImports,
  ],
  providers: [InterventionsService, { provide: LAZY_MAPS_API_CONFIG, useFactory: mapsConfigFactory }],
})
export class InterventionsModule {}

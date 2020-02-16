import { Pipe, PipeTransform } from '@angular/core';
import { InterventionStatus, InterventionStatusMap } from '@shared/domain/intervention.status';

@Pipe({
  name: 'ekoInterventionStatus',
})
export class InterventionStatusPipe implements PipeTransform {
  transform(value: InterventionStatus): string {
    return InterventionStatusMap.get(value) || String(value);
  }
}
